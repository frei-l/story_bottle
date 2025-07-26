import React, { useEffect, useRef, useState, useCallback } from 'react';
import './OpenStreetMap.css';

interface LocationInfo {
    lng: number;
    lat: number;
    address: string;
    accuracy: number;
}

interface MarkedArea {
    id: string;
    lng: number;
    lat: number;
}

interface DisplayMarker {
    id: string;
    lng: number;
    lat: number;
    marker?: any;
    circleLayer?: string;
    sourceId?: string;
    count: number;
    originalMarkers: MarkedArea[];
}

const OpenStreetMap: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(null);
    const [allMarkers, setAllMarkers] = useState<MarkedArea[]>([]);
    const [displayMarkers, setDisplayMarkers] = useState<DisplayMarker[]>([]);
    const [currentZoom, setCurrentZoom] = useState(15);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const mapInstanceRef = useRef<any>(null);

    // 创建星星图标
    const createStarElement = useCallback((color: string, scale: number) => {
        const star = document.createElement('div');
        star.style.width = `${20 * scale}px`;
        star.style.height = `${20 * scale}px`;
        star.style.position = 'absolute';
        star.style.display = 'inline-block';
        star.style.margin = '0';
        star.style.padding = '0';
        star.style.pointerEvents = 'auto';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', `${20 * scale}`);
        svg.setAttribute('height', `${20 * scale}`);
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.style.display = 'block';
        svg.style.width = '100%';
        svg.style.height = '100%';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z');
        path.setAttribute('fill', color);
        path.setAttribute('stroke', '#fff');
        path.setAttribute('stroke-width', '1');

        svg.appendChild(path);
        star.appendChild(svg);

        return star;
    }, []);

    // 计算两点之间的距离
    const getDistance = useCallback((lng1: number, lat1: number, lng2: number, lat2: number): number => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    // 获取地图比例尺下的实际聚类距离（米）
    const getClusterDistance = useCallback((): number => {
        if (!mapInstanceRef.current) return 100;

        // 获取地图中心点的像素坐标
        const center = mapInstanceRef.current.getCenter();
        const pixel1 = mapInstanceRef.current.project(center);
        const pixel2 = mapInstanceRef.current.project([center.lng + 0.001, center.lat]);

        // 计算每像素对应的米数
        const metersPerPixel = getDistance(center.lng, center.lat, center.lng + 0.001, center.lat) / Math.abs(pixel2.x - pixel1.x);

        // 根据地图比例尺动态调整聚类距离
        if (metersPerPixel < 1) return 50;      // 非常近的距离
        if (metersPerPixel < 5) return 100;     // 近距离
        if (metersPerPixel < 20) return 200;    // 中距离
        if (metersPerPixel < 100) return 500;   // 远距离
        return 1000;                            // 非常远距离
    }, [getDistance]);

    // 创建圆形坐标数组（已修复坐标计算）
    const createCircle = useCallback((center: [number, number], radius: number): [number, number][] => {
        const points: [number, number][] = [];
        const steps = 64;
        const R = 6371000; // 地球半径（米）

        for (let i = 0; i < steps; i++) {
            const angle = (i / steps) * 2 * Math.PI;
            const latOffset = (radius / R) * (180 / Math.PI) * Math.sin(angle);
            const lngOffset = (radius / R) * (180 / Math.PI) * Math.cos(angle) / Math.cos(center[1] * Math.PI / 180);

            const lat = center[1] + latOffset;
            const lng = center[0] + lngOffset;
            points.push([lng, lat]);
        }

        return points;
    }, []);

    // 更新显示标记 - 实现星星标记的聚类功能
    const updateDisplayMarkers = useCallback(() => {
        if (!mapInstanceRef.current || allMarkers.length === 0) return;

        // 清除现有显示标记
        displayMarkers.forEach(area => {
            if (area.marker) area.marker.remove();
            if (area.circleLayer && mapInstanceRef.current.getLayer(area.circleLayer)) {
                mapInstanceRef.current.removeLayer(area.circleLayer);
            }
            if (area.sourceId && mapInstanceRef.current.getSource(area.sourceId)) {
                mapInstanceRef.current.removeSource(area.sourceId);
            }
        });

        // 获取当前聚类距离
        const clusterDistance = getClusterDistance();

        // 实现聚类算法
        const clusters: DisplayMarker[] = [];
        const processed = new Set<string>();

        // 对每个标记进行聚类处理
        allMarkers.forEach((marker, index) => {
            if (processed.has(marker.id)) return;

            // 找到所有在聚类距离内的标记
            const clusterMarkers = [marker];
            processed.add(marker.id);

            allMarkers.forEach((otherMarker, otherIndex) => {
                if (index === otherIndex || processed.has(otherMarker.id)) return;

                const distance = getDistance(marker.lng, marker.lat, otherMarker.lng, otherMarker.lat);
                if (distance <= clusterDistance) {
                    clusterMarkers.push(otherMarker);
                    processed.add(otherMarker.id);
                }
            });

            // 计算聚类中心点
            if (clusterMarkers.length === 1) {
                // 单个标记，直接显示
                clusters.push({
                    id: marker.id,
                    lng: marker.lng,
                    lat: marker.lat,
                    count: 1,
                    originalMarkers: [marker]
                });
            } else {
                // 多个标记，计算中心点
                const centerLng = clusterMarkers.reduce((sum, m) => sum + m.lng, 0) / clusterMarkers.length;
                const centerLat = clusterMarkers.reduce((sum, m) => sum + m.lat, 0) / clusterMarkers.length;

                clusters.push({
                    id: `cluster_${marker.id}`,
                    lng: centerLng,
                    lat: centerLat,
                    count: clusterMarkers.length,
                    originalMarkers: clusterMarkers
                });
            }
        });

        setDisplayMarkers(clusters);

        // 渲染聚类后的标记
        clusters.forEach(cluster => {
            let markerElement;
            let scale = 1.0;

            if (cluster.count === 1) {
                // 单个标记显示星星
                markerElement = createStarElement('#ff0000', 1.0);
            } else {
                // 聚类标记显示带数字的圆圈
                markerElement = document.createElement('div');
                markerElement.style.width = '30px';
                markerElement.style.height = '30px';
                markerElement.style.borderRadius = '50%';
                markerElement.style.backgroundColor = '#ff4444';
                markerElement.style.color = 'white';
                markerElement.style.display = 'flex';
                markerElement.style.alignItems = 'center';
                markerElement.style.justifyContent = 'center';
                markerElement.style.fontSize = '12px';
                markerElement.style.fontWeight = 'bold';
                markerElement.style.border = '2px solid white';
                markerElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                markerElement.textContent = cluster.count.toString();
                scale = 1.2;
            }

            const marker = new (window as any).maplibregl.Marker({
                element: markerElement,
                anchor: 'center',
                offset: [0, 0]
            })
                .setLngLat([cluster.lng, cluster.lat])
                .addTo(mapInstanceRef.current);

            cluster.marker = marker;

            marker.getElement().addEventListener('click', () => {
                if (cluster.count === 1) {
                    // 单个标记的弹窗
                    new (window as any).maplibregl.Popup({
                        closeButton: false
                    })
                        .setLngLat([cluster.lng, cluster.lat])
                        .setHTML(`
                            <div style="padding: 8px; color: #424242;">
                                <h4>标记点</h4>
                                <p>坐标: ${cluster.lng.toFixed(6)}, ${cluster.lat.toFixed(6)}</p>
                            </div>
                        `)
                        .addTo(mapInstanceRef.current);
                } else {
                    // 聚类标记的弹窗
                    const markersList = cluster.originalMarkers
                        .map(m => `<li>${m.lng.toFixed(4)}, ${m.lat.toFixed(4)}</li>`)
                        .join('');

                    new (window as any).maplibregl.Popup({
                        closeButton: false
                    })
                        .setLngLat([cluster.lng, cluster.lat])
                        .setHTML(`
                            <div style="padding: 8px; color: #424242; min-width: 200px;">
                                <h4>聚类标记 (${cluster.count}个)</h4>
                                <ul style="margin: 5px 0; padding-left: 20px; font-size: 11px;">
                                    ${markersList}
                                </ul>
                            </div>
                        `)
                        .addTo(mapInstanceRef.current);
                }
            });
        });
    }, [allMarkers, displayMarkers, createStarElement, getClusterDistance, getDistance]);

    // 初始化地图
    const initMap = useCallback(() => {
        const maplibregl = (window as any).maplibregl;

        if (!maplibregl) {
            console.error('MapLibre GL JS not loaded');
            return;
        }

        const map = new maplibregl.Map({
            container: 'openstreetmap',
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '© OpenStreetMap contributors'
                    }
                },
                layers: [
                    {
                        id: 'osm-tiles',
                        type: 'raster',
                        source: 'osm',
                        paint: {
                            'raster-saturation': -1,
                            'raster-contrast': 0.1,
                            'raster-brightness-min': 0.1,
                            'raster-brightness-max': 0.9
                        }
                    }
                ]
            },
            center: [120.003618, 30.295699],
            zoom: 15,
            pitch: 0,
            bearing: 0
        });

        map.addControl(new maplibregl.NavigationControl({
            showCompass: false,
            showZoom: true
        }), 'top-right');

        map.addControl(new maplibregl.ScaleControl({
            maxWidth: 100,
            unit: 'metric'
        }), 'bottom-right');

        map.on('zoom', () => {
            setCurrentZoom(map.getZoom());
        });

        map.on('dblclick', (e: any) => {
            e.preventDefault();
            const lng = e.lngLat.lng;
            const lat = e.lngLat.lat;

            const newMarker: MarkedArea = {
                id: `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                lng,
                lat
            };

            setAllMarkers(prev => [...prev, newMarker]);
        });

        map.on('load', () => {
            map.setPaintProperty('osm-tiles', 'raster-saturation', -1);
            map.setPaintProperty('osm-tiles', 'raster-contrast', 0.2);
            map.setPaintProperty('osm-tiles', 'raster-brightness-min', 0.1);
            map.setPaintProperty('osm-tiles', 'raster-brightness-max', 0.9);
        });

        mapInstanceRef.current = map;
        mapRef.current = map;
    }, []);

    // 获取当前位置
    const getCurrentLocation = useCallback(() => {
        if (!mapInstanceRef.current) {
            alert('地图未初始化');
            return;
        }

        setLoading(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lng = position.coords.longitude;
                    const lat = position.coords.latitude;
                    const accuracy = position.coords.accuracy;

                    if (markerRef.current) {
                        markerRef.current.remove();
                    }

                    markerRef.current = new (window as any).maplibregl.Marker({
                        color: '#424242',
                        scale: 0.8
                    })
                        .setLngLat([lng, lat])
                        .addTo(mapInstanceRef.current);

                    mapInstanceRef.current.flyTo({
                        center: [lng, lat],
                        zoom: 16,
                        duration: 1000
                    });

                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=zh-CN`)
                        .then(res => res.json())
                        .then(data => {
                            const address = data.display_name || '未知地址';
                            setCurrentLocation({
                                lng,
                                lat,
                                address,
                                accuracy: Math.round(accuracy)
                            });

                            const popup = new (window as any).maplibregl.Popup({
                                offset: 25,
                                closeButton: false
                            })
                                .setLngLat([lng, lat])
                                .setHTML(`
                                    <div style="padding: 8px; min-width: 200px;">
                                        <h4>当前位置</h4>
                                        <p>地址：${address}</p>
                                        <p>坐标：${lng.toFixed(6)}, ${lat.toFixed(6)}</p>
                                        <p>精度：${Math.round(accuracy)} 米</p>
                                    </div>
                                `)
                                .addTo(mapInstanceRef.current);

                            markerRef.current.setPopup(popup);
                            setLoading(false);
                        })
                        .catch(error => {
                            console.error('地址解析失败:', error);
                            setLoading(false);
                        });
                },
                (error) => {
                    console.error('定位失败:', error);
                    alert('定位失败，请检查权限设置');
                    setLoading(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 30000
                }
            );
        } else {
            alert('浏览器不支持地理定位');
            setLoading(false);
        }
    }, []);

    // 删除单个标记
    const removeSingleMarker = useCallback((index: number) => {
        setAllMarkers(prev => prev.filter((_, i) => i !== index));
    }, []);

    // 跳转到指定坐标并显示范围圈
    const navigateToMarker = useCallback((lng: number, lat: number, index: number) => {
        if (!mapInstanceRef.current) return;

        // 清除之前的范围圈
        if (mapInstanceRef.current.getLayer('range-circle')) {
            mapInstanceRef.current.removeLayer('range-circle');
        }
        if (mapInstanceRef.current.getSource('range-circle-source')) {
            mapInstanceRef.current.removeSource('range-circle-source');
        }

        // 飞转到指定坐标
        mapInstanceRef.current.flyTo({
            center: [lng, lat],
            zoom: 17,
            duration: 1000
        });

        // 创建红色圆形范围圈
        const circleData = {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [createCircle([lng, lat], 100)]
            }
        };

        // 添加范围圈数据源
        mapInstanceRef.current.addSource('range-circle-source', {
            type: 'geojson',
            data: circleData
        });

        // 添加范围圈图层
        mapInstanceRef.current.addLayer({
            id: 'range-circle',
            type: 'fill',
            source: 'range-circle-source',
            layout: {},
            paint: {
                'fill-color': '#ff0000',
                'fill-opacity': 0.2,
                'fill-outline-color': '#ff0000'
            }
        });
    }, [createCircle]);

    // 加载地图库
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js';
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css';
        document.head.appendChild(link);

        script.onload = () => {
            initMap();
            getCurrentLocation();
        };

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
            }
        };
    }, [initMap, getCurrentLocation]);

    // 更新显示标记
    useEffect(() => {
        updateDisplayMarkers();
    }, [allMarkers, currentZoom, updateDisplayMarkers]);

    return (
        <div className="map-container">
            <div className="map-wrapper">
                <div id="openstreetmap" className="map-content"></div>

                <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className="sidebar-header" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                        <h3>标记列表 ({allMarkers.length})</h3>
                        <span className="toggle-icon">{isSidebarCollapsed ? '◀' : '▶'}</span>
                    </div>

                    <div className="sidebar-content" style={{ display: isSidebarCollapsed ? 'none' : 'block' }}>
                        {currentLocation && (
                            <div className="location-info">
                                <h4>当前位置</h4>
                                <p><strong>地址：</strong>{currentLocation.address}</p>
                                <p><strong>坐标：</strong>{currentLocation.lng.toFixed(6)}, {currentLocation.lat.toFixed(6)}</p>
                                <p><strong>精度：</strong>{currentLocation.accuracy} 米</p>
                            </div>
                        )}

                        {allMarkers.length > 0 ? (
                            <div className="marked-areas">
                                <div className="area-list">
                                    {allMarkers.map((area, index) => (
                                        <div key={area.id} className="area-item">
                                            <div
                                                className="area-info"
                                                onClick={() => navigateToMarker(area.lng, area.lat, index)}
                                                style={{ cursor: 'pointer' }}
                                                title="点击跳转到此位置"
                                            >
                                                <span className="area-coords">
                                                    {area.lng.toFixed(6)}, {area.lat.toFixed(6)}
                                                </span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeSingleMarker(index);
                                                }}
                                                className="remove-btn"
                                                title="删除"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>双击地图添加标记</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenStreetMap;

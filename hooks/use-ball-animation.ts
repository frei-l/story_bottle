import { useBallStore, type Sphere } from "@/lib/ball-store"

export const useBallAnimation = () => {
    const { ballsActivated, ballStates } = useBallStore()

    const getColoredBallAnimation = (ballIndex: number, originalSphere: Sphere) => {
        if (!ballsActivated) {
            // 状态一：默认浮动动画
            return {
                animate: {
                    x: [0, 10, -5, 8, 0],
                    y: [0, -8, 12, -5, 0],
                    scale: [1, 1.05, 0.95, 1.02, 1],
                },
                transition: {
                    repeat: Infinity,
                    duration: 10 + originalSphere.delay,
                    delay: originalSphere.delay,
                }
            }
        }

        const ballState = ballStates.find(b => b.id === ballIndex)
        if (!ballState) return { animate: {}, transition: {} }

        if (ballState.stage === 'floating') {
            // 浮动状态
            return {
                animate: {
                    x: [0, 10, -5, 8, 0],
                    y: [0, -8, 12, -5, 0],
                    scale: [1, 1.05, 0.95, 1.02, 1],
                },
                transition: {
                    repeat: Infinity,
                    duration: 10 + originalSphere.delay,
                    delay: originalSphere.delay,
                }
            }
        }

        // 激活状态：连续路径动画（初始位置 → 瓶口 → 屏幕中央）
        if (ballState.stage === 'activated') {
            // 计算路径关键点
            const bottleNeckX = 0 // 瓶口X位置（相对于瓶子中心）
            const bottleNeckY = -300 // 瓶口Y位置

            // 计算到屏幕真正中央的偏移量
            // 基于瓶子在页面中的位置，计算到屏幕中央的精确偏移
            const screenCenterOffsetY = -150 // 向上移动到屏幕中央（调整）
            const ballSpacing = 100 // 球之间的间距（稍微增加）
            const centerTargetX = (ballIndex - 1) * ballSpacing // -100, 0, 100
            const centerTargetY = screenCenterOffsetY // 屏幕中央

            // 关键帧路径：[初始位置, 瓶口, 屏幕中央]
            const pathX = [0, bottleNeckX, centerTargetX]
            const pathY = [0, bottleNeckY, centerTargetY]
            const pathScale = [1, 0.8, 1.3]

            return {
                animate: {
                    x: pathX,
                    y: pathY,
                    scale: pathScale,
                },
                transition: {
                    duration: 3, // 总动画时长3秒
                    delay: ballState.startDelay, // 每个球的起始延迟
                    times: [0, 0.4, 1], // 关键帧时间点：0秒开始，1.2秒到瓶口，3秒到中央
                }
            }
        }

        return { animate: {}, transition: {} }
    }

    return {
        getColoredBallAnimation
    }
} 
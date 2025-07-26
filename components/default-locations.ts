import notesData from "@/components/notes-data"

const nearLocations = [
    { lng: 120.011618, lat: 30.295699 }, // 东约800米
    { lng: 119.995618, lat: 30.295699 }, // 西约800米
    { lng: 120.003618, lat: 30.304699 }, // 北约1公里
    { lng: 120.003618, lat: 30.286699 }, // 南约1公里
    { lng: 120.008618, lat: 30.300699 }, // 东北约700米
    { lng: 119.998618, lat: 30.290699 }, // 西南约700米
];
const storieLocations = notesData.map(item => { return { lng: item.coodinates[0], lat: item.coodinates[1] } })

export const defaultLocations = [...nearLocations, ...storieLocations]
export const currentLocation = { lng: 120.003618, lat: 30.295699 };


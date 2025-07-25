import { create } from 'zustand'

export type BallStage = 'floating' | 'activated'

export interface BallState {
    id: number
    stage: BallStage
    startDelay: number
}

export interface Sphere {
    id: number
    x: number
    y: number
    size: number
    color: string
    delay: number
}

interface BallStore {
    // 状态
    spheres: Sphere[]
    ballsActivated: boolean
    ballStates: BallState[]
    activationTime: number

    // 动作
    setSpheres: (spheres: Sphere[]) => void
    setBallStates: (ballStates: BallState[]) => void
    activateBalls: () => void
    updateBallStage: (ballId: number, stage: BallStage) => void
    updateBallStages: () => void
    resetBalls: () => void
}

export const useBallStore = create<BallStore>((set, get) => ({
    // 初始状态
    spheres: [],
    ballsActivated: false,
    ballStates: [],
    activationTime: 0,

    // 设置所有球的数据
    setSpheres: (spheres) => set({ spheres }),

    // 设置球的状态
    setBallStates: (ballStates) => set({ ballStates }),

    // 激活彩色小球
    activateBalls: () => {
        const { ballStates } = get()
        const updatedBallStates = ballStates.map(ball => ({
            ...ball,
            stage: 'activated' as const
        }))

        set({
            ballsActivated: true,
            activationTime: Date.now(),
            ballStates: updatedBallStates
        })
    },

    // 更新单个球的状态
    updateBallStage: (ballId, stage) => set((state) => ({
        ballStates: state.ballStates.map(ball =>
            ball.id === ballId ? { ...ball, stage } : ball
        )
    })),

    // 批量更新球的状态（现在简化了，因为使用连续动画）
    updateBallStages: () => {
        // 连续动画不需要复杂的阶段更新逻辑
        // 动画由 framer-motion 的关键帧自动处理
    },

    // 重置状态
    resetBalls: () => set({
        ballsActivated: false,
        activationTime: 0,
        ballStates: get().ballStates.map(ball => ({ ...ball, stage: 'floating' as const }))
    })
})) 
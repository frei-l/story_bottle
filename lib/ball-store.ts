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
    activateBalls: (withVibration?: boolean) => void
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
    activateBalls: (withVibration = true) => {
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

        // 触发持续震动反馈（如果支持且启用）
        if (withVibration && typeof window !== 'undefined') {
            import('../lib/haptics').then(({ triggerVibration }) => {
                // 模拟瓶子摇晃的震动模式：1秒持续震动
                // 对应瓶子动画的摇晃节奏，降低频率增强震感
                const shakePattern = [
                    80, 120,  // 第一次摇晃（更强）
                    80, 120,  // 第二次摇晃
                    80, 120,  // 第三次摇晃
                    60, 100,  // 第四次摇晃（稍弱）
                    60, 100,  // 第五次摇晃
                    40        // 最后一次轻微震动
                ]
                triggerVibration(shakePattern)
            })
        }
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
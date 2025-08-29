import { NextResponse } from 'next/server'
import { YIELD_FARMS, calculateFarmRewards, calculateAPR } from '../../../contracts/YieldFarm.algo'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('address')
    
    // Mock LP token and DEGEN prices
    const lpTokenPrice = 2.5 // $2.50 per LP token
    const degenPrice = 0.001 // $0.001 per DEGEN
    
    const farmsWithAPR = YIELD_FARMS.map(farm => ({
      ...farm,
      apr: calculateAPR(farm, lpTokenPrice, degenPrice),
      tvl: farm.totalStaked * lpTokenPrice,
      dailyRewards: farm.rewardRate * 24 * 60 * 60
    }))
    
    // Mock user positions
    let userPositions = []
    if (userAddress) {
      userPositions = [
        {
          id: 'pos_1',
          farmId: 'algo_degen_farm',
          stakedAmount: 1000,
          pendingRewards: calculateFarmRewards(
            {
              id: 'pos_1',
              farmId: 'algo_degen_farm',
              userAddress,
              stakedAmount: 1000,
              rewardDebt: 0,
              lastUpdateTime: Date.now() / 1000 - 86400 // 1 day ago
            },
            YIELD_FARMS[0],
            Date.now() / 1000
          ),
          value: 1000 * lpTokenPrice
        }
      ]
    }
    
    return NextResponse.json({
      success: true,
      data: {
        farms: farmsWithAPR,
        userPositions,
        totalTVL: farmsWithAPR.reduce((sum, farm) => sum + farm.tvl, 0)
      }
    })
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch farming data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { action, farmId, amount, userAddress } = await request.json()
    
    const farm = YIELD_FARMS.find(f => f.id === farmId)
    if (!farm) {
      return NextResponse.json(
        { success: false, error: 'Farm not found' },
        { status: 404 }
      )
    }
    
    if (action === 'stake') {
      return NextResponse.json({
        success: true,
        data: {
          txId: `stake_${Date.now()}`,
          farmId,
          stakedAmount: amount,
          userAddress,
          estimatedDailyRewards: (amount / farm.totalStaked) * farm.rewardRate * 86400
        }
      })
    }
    
    if (action === 'harvest') {
      const mockRewards = 150 // Mock pending rewards
      
      return NextResponse.json({
        success: true,
        data: {
          txId: `harvest_${Date.now()}`,
          farmId,
          harvestedRewards: mockRewards,
          userAddress
        }
      })
    }
    
    if (action === 'unstake') {
      return NextResponse.json({
        success: true,
        data: {
          txId: `unstake_${Date.now()}`,
          farmId,
          unstakedAmount: amount,
          userAddress
        }
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process farming transaction' },
      { status: 500 }
    )
  }
}
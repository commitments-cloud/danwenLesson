import React from 'react'
import { Spin, Typography } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const { Text } = Typography

interface LoadingSpinnerProps {
  text?: string
  size?: 'small' | 'default' | 'large'
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = '加载中...', 
  size = 'large' 
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 48 : size === 'default' ? 32 : 24 }} spin />

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      <Spin indicator={antIcon} size={size} />
      <Text type="secondary" className="mt-4 text-base">
        {text}
      </Text>
    </div>
  )
}

export default LoadingSpinner

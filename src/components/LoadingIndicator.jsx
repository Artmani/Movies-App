import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

function LoadingIndicator() {
  return (
    <div className="loading-indicator">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  )
}

export default LoadingIndicator

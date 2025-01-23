import React from 'react'
import { Spin, Flex } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

function LoadingIndicator() {
  return (
    <Flex justify="center" className="loading-indicator">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </Flex>
  )
}

export default LoadingIndicator

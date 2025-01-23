import React from 'react'
import { Alert } from 'antd'

function OfflineAlert() {
  return (
    <Alert
      message="Нет подключения к сети"
      description="Проверьте подключение к Интернету."
      type="warning"
      showIcon
      style={{ marginBottom: 20 }}
    />
  )
}

export default OfflineAlert

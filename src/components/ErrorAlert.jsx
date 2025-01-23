import React from 'react'
import { Alert } from 'antd'
import PropTypes from 'prop-types'

function ErrorAlert({ message }) {
  return <Alert message="Ошибка загрузки" description={message} type="error" showIcon style={{ marginBottom: 20 }} />
}

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
}

export default ErrorAlert

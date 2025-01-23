import React from 'react'
import { Flex, Input } from 'antd'

function MovieSearch({ onSearch }) {
  return (
    <Flex justify="center">
      <Input placeholder="Печатай..." onChange={(e) => onSearch(e.target.value)} style={{ width: 938, margin: 25 }} />
    </Flex>
  )
}

export default MovieSearch

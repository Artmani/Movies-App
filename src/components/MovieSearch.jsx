import React from 'react'
import { Flex, Input } from 'antd'

function MovieSearch({ onSearch }) {
  return (
    <Flex justify="center">
      <Input placeholder="Печатай..." onChange={(e) => onSearch(e.target.value)} style={{ margin: 25 }} />
    </Flex>
  )
}

export default MovieSearch

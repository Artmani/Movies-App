import React from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'

function MoviePagination({ totalPages, currentPage, onPageChange }) {
  return (
    <Pagination
      align="center"
      current={currentPage}
      pageSize={20}
      showSizeChanger={false}
      onChange={onPageChange}
      defaultPageSize={20}
      total={totalPages * 20}
      style={{
        marginTop: 20,
      }}
    />
  )
}

MoviePagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default MoviePagination

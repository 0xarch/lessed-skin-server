import React from 'react'
import Skeleton from 'react-loading-skeleton'

const LoadingRow: React.FC = () => (
  <tr>
    <td colSpan={6}>
      <Skeleton />
    </td>
  </tr>
)

export default LoadingRow

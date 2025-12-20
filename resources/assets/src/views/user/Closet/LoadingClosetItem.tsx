import React from 'react'
import styled from '@emotion/styled'
import Skeleton from 'react-loading-skeleton'
import { DropdownButton } from './styles'
import { Card } from '@/components/_FluentComponents'

const ItemNameSkeleton = styled(Skeleton)`
  width: 150px;
`

const LoadingClosetItem: React.FC = () => (
  <Card>
    <body></body>
    <footer>
      <div className="container d-flex justify-content-between">
        <ItemNameSkeleton />
        <span className="d-inline-block">
          <DropdownButton>
            <i className="fas fa-cog" />
          </DropdownButton>
        </span>
      </div>
    </footer>
  </Card>
)

export default LoadingClosetItem

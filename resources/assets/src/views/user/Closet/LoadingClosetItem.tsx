import React from 'react'
import Card from '@/components/mdui/card'
import { Img } from './styles'

const LoadingClosetItem: React.FC = () => (
  <Card style={{ width: 'fit-content' }}>
    <Img src="" />
    <footer>
      <div className="container d-flex justify-content-between">
        <span style={{ marginRight: 'auto' }} />
        <mdui-button-icon icon="more_vert" />
      </div>
    </footer>
  </Card>
)

export default LoadingClosetItem

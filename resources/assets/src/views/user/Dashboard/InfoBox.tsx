import Card from '@/components/mdui/card'
import Divider from '@/components/mdui/divider'
import React from 'react'

interface Props {
  name: string
  icon: string
  color: string
  used: number
  unused: number
  unit: string
}

const InfoBox: React.FC<Props> = (props) => {
  const total = ~~(props.used + props.unused)
  const percentage = (props.used / total) * 100

  return (
    <Card prose variant="outlined">
      <h4 className="d-flex align-items-center">
        <mdui-icon name={props.icon} />
        {props.name}
      </h4>
      <Divider space-only />
      <span>
        <b>{props.used}</b> / {total} {props.unit}
      </span>
      <mdui-linear-progress value={percentage} max={100} />
    </Card>
  )
}

export default React.memo(InfoBox)

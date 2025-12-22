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
    // @ts-ignore
    <mdui-card
      variant="outlined"
      class="md-card mdui-prose"
      style={{ display: 'block' }}
    >
      <h4>
        <mdui-icon name={props.icon} />
        {props.name}
      </h4>
      <span>
        <b>{props.used}</b> / {total} {props.unit}
      </span>
      <mdui-linear-progress value={percentage} max={100} />
    </mdui-card>
  )
}

export default React.memo(InfoBox)

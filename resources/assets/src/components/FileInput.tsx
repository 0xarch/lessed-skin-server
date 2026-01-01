import { useRef } from 'react'
import { t } from '@/scripts/i18n'

interface Props {
  file: File | null
  accept?: string
  onChange(event: React.ChangeEvent<HTMLInputElement>): void
}

const FileInput: React.FC<Props> = (props) => {
  const ref = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    ref.current!.click()
  }

  return (
    <mdui-card
      variant="filled"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <input
        type="file"
        className="custom-file-input"
        id="select-file"
        accept={props.accept}
        ref={ref}
        onChange={props.onChange}
      />
      <mdui-button onClick={handleClick}>
        {t('skinlib.upload.select-file')}
      </mdui-button>
      <div className="custom-file" style={{ overflow: 'hidden' }}>
        <label className="custom-file-label">{props.file?.name}</label>
      </div>
    </mdui-card>
  )
}

export default FileInput

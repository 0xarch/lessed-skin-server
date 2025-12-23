import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { t } from '@/scripts/i18n'
import useBlessingExtra from '@/scripts/hooks/useBlessingExtra'
import useEmitMounted from '@/scripts/hooks/useEmitMounted'
import useMount from '@/scripts/hooks/useMount'
import * as fetch from '@/scripts/net'
import { showModal, toast } from '@/scripts/notify'
import { isAlex } from '@/scripts/textureUtils'
import { TextureType } from '@/scripts/types'
import urls from '@/scripts/urls'
import FileInput from '@/components/FileInput'
import ViewerSkeleton from '@/components/ViewerSkeleton'
import { Card } from '@/components/_FluentComponents'
import { Checkbox, RadioGroup, TextField } from 'mdui'

const Previewer = React.lazy(() => import('@/components/Viewer'))

const Upload: React.FC = () => {
  const [name, setName] = useState('')
  const [type, setType] = useState(TextureType.Steve)
  const [isPrivate, setIsPrivate] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [texture, setTexture] = useState('')
  const nameRule = useBlessingExtra<string>('rule')
  const contentPolicy = useBlessingExtra<string>('contentPolicy')
  const privacyNotice = useBlessingExtra<string>('privacyNotice')
  const award = useBlessingExtra<number>('award')
  const currentScore = useBlessingExtra<number>('score', 0)
  const scorePublic = useBlessingExtra<number>('scorePublic')
  const scorePrivate = useBlessingExtra<number>('scorePrivate')
  const closetItemCost = useBlessingExtra<number>('closetItemCost')

  const container = useMount('#previewer')
  const textureNameRef = useRef<HTMLInputElement>(null)
  const textureTypeRef = useRef<RadioGroup>(null)
  const isPrivateCheckRef = useRef<Checkbox>(null)

  useEmitMounted()

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value as TextureType)
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files!
    const [file] = files
    if (file) {
      setFile(file)
      if (!name && file.name.endsWith('.png')) {
        setName(file.name.slice(0, file.name.length - 4))
      }
      const texture = URL.createObjectURL(file)
      setTexture(texture)
      if (type !== TextureType.Cape) {
        setType((await isAlex(texture)) ? TextureType.Alex : TextureType.Steve)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error(t('skinlib.emptyUploadFile'))
      return
    }

    if (!name) {
      toast.error(t('skinlib.emptyTextureName'))
      return
    }

    if (file.type !== 'image/png' && file.type !== 'image/x-png') {
      toast.error(t('skinlib.fileExtError'))
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('type', type)
    formData.append('file', file, file.name)
    formData.append('public', isPrivate ? '0' : '1')

    setIsUploading(true)
    const {
      code,
      message,
      data: { tid } = { tid: 0 },
    } = await fetch.post<fetch.ResponseBody<{ tid: number }>>(
      urls.texture.upload(),
      formData,
    )
    setIsUploading(false)

    if (code === 0) {
      window.location.href = blessing.base_url + urls.skinlib.show(tid)
    } else if (code === 2) {
      try {
        await showModal({
          mode: 'confirm',
          text: message,
          okButtonText: t('user.viewInSkinlib'),
        })
        window.location.href = blessing.base_url + urls.skinlib.show(tid)
      } catch {
        //
      }
    } else {
      toast.error(message)
    }
  }

  const costRatio = isPrivate ? scorePrivate : scorePublic
  const size = file?.size ?? 0
  const scoreCost = Math.ceil(size / 1024) * costRatio + closetItemCost

  useEffect(() => {
    const textureInput = textureNameRef.current
    if (textureInput) {
      textureInput.addEventListener('change', () => {
        setName(textureInput.value)
      })
    }
    const textureType = textureTypeRef.current
    if (textureType) {
      textureType.addEventListener('change', () => {
        setType(textureType.value as TextureType)
      })
    }
    const isPrivateCheck = isPrivateCheckRef.current
    if (isPrivateCheck) {
      isPrivateCheck.addEventListener('change', () => {
        setIsPrivate(isPrivateCheck.checked)
      })
    }
  })

  return (
    <>
      <mdui-card class="md-card mdui-prose">
        <mdui-text-field
          label={t('skinlib.upload.texture-name')}
          id="texture-name"
          placeholder={nameRule}
          value={name}
          ref={textureNameRef}
        />
        <br className="md-br" />
        <h4>{t('skinlib.upload.texture-type')}</h4>
        <mdui-radio-group ref={textureTypeRef} value={type}>
          <mdui-radio value="steve">Steve</mdui-radio>
          <mdui-radio value="alex">Alex</mdui-radio>
          <mdui-radio value="cape">{t('general.cape')}</mdui-radio>
        </mdui-radio-group>
        <br className="md-br" />
        <FileInput
          file={file}
          accept="image/png, image/x-png"
          onChange={handleFileChange}
        />

        {contentPolicy && (
          <>
            <br />
            <div
              className="callout callout-warning"
              dangerouslySetInnerHTML={{ __html: contentPolicy }}
            />
          </>
        )}
        <br className="md-br" />
        <footer>
          <div className="container d-flex justify-content-between">
            <mdui-checkbox
              id="is-private"
              checked={isPrivate}
              ref={isPrivateCheckRef}
            >
              {t('skinlib.upload.set-as-private')}
            </mdui-checkbox>
            <mdui-button
              disabled={isUploading}
              onClick={handleUpload}
              loading={isUploading}
            >
              {t('skinlib.upload.button')}
            </mdui-button>
          </div>
          {isPrivate && (
            <>
              <br />
              <mdui-card class="md-card mdui-prose" variant="outlined">
                {privacyNotice}
              </mdui-card>
            </>
          )}
          {!isPrivate && award > 0 && (
            <>
              <br />
              <div className="callout callout-success mt-3">
                {t('skinlib.upload.award', { score: award })}
              </div>
            </>
          )}
          {file && (
            <>
              <br className="md-br" />
              <div
                className={`callout callout-${
                  currentScore > scoreCost ? 'success' : 'danger'
                } mt-3`}
              >
                <div>{t('skinlib.upload.cost', { score: scoreCost })}</div>
                <div>
                  {t('user.cur-score')}
                  <span className="ml-1">{currentScore}</span>
                </div>
              </div>
            </>
          )}
        </footer>
      </mdui-card>
      {container &&
        ReactDOM.createPortal(
          <React.Suspense fallback={<ViewerSkeleton />}>
            <Previewer
              skin={type !== TextureType.Cape ? texture : undefined}
              cape={type === TextureType.Cape ? texture : undefined}
              isAlex={type === TextureType.Alex}
            />
          </React.Suspense>,
          container,
        )}
    </>
  )
}

export default hot(Upload)

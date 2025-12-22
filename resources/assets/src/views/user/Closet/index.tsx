import React, { useState, useEffect, useRef } from 'react'
import { hot } from 'react-hot-loader/root'
import debounce from 'lodash.debounce'
import useEmitMounted from '@/scripts/hooks/useEmitMounted'
import { t } from '@/scripts/i18n'
import * as fetch from '@/scripts/net'
import { showModal } from '@/scripts/notify'
import {
  ClosetItem as Item,
  Texture,
  Paginator,
  TextureType,
} from '@/scripts/types'
import urls from '@/scripts/urls'
import Pagination from '@/components/Pagination'
import ClosetItem from './ClosetItem'
import LoadingClosetItem from './LoadingClosetItem'
import Previewer from './Previewer'
import ModalApply from './ModalApply'
import removeClosetItem from './removeClosetItem'
import { alert, prompt, snackbar } from 'mdui'

type Category = 'skin' | 'cape'

const Closet: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState<Category>('skin')
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [items, setItems] = useState<Item[]>([])
  const [skin, setSkin] = useState<Texture | null>(null)
  const [cape, setCape] = useState<Texture | null>(null)
  const [showModalApply, setShowModalApply] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const perPageRef = useRef(6)

  useEmitMounted()

  useEffect(() => {
    const element = containerRef.current
    /* istanbul ignore next */
    if (element) {
      const { width } = element.getBoundingClientRect()
      if (width >= 500) {
        perPageRef.current = Math.floor(width / 235) * 2
      }
    }
  }, [])

  useEffect(() => {
    const getItems = async () => {
      setIsLoading(true)
      const { data, last_page } = await fetch.get<Paginator<Item>>(
        urls.user.closet.list(),
        { category, q: query, page, perPage: perPageRef.current },
      )

      setItems(data)
      setTotalPages(last_page)
      setIsLoading(false)
    }
    getItems()
  }, [category, query, page])

  const switchCategoryToSkin = () => {
    if (category !== 'skin') {
      setCategory('skin')
      setPage(1)
    }
  }

  const switchCategoryToCape = () => {
    if (category !== 'cape') {
      setCategory('cape')
      setPage(1)
    }
  }

  const debouncedSetQuery = React.useMemo(
    () => debounce((value: string) => setQuery(value), 350),
    [setQuery], // setQuery 是稳定的，所以这个 debounced 函数也会是稳定的
  )

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearch(value)
    debouncedSetQuery
  }

  const handlePageChange = (page: number) => setPage(page)

  const isSelected = (item: Item): boolean => {
    if (category === 'skin') {
      return item.tid === skin?.tid
    } else {
      return item.tid === cape?.tid
    }
  }

  const handleSelect = (item: Item) => {
    if (item.type === TextureType.Cape) {
      setCape(item)
    } else {
      setSkin(item)
    }
  }

  const resetSelected = () => {
    setSkin(null)
    setCape(null)
  }

  const renameItem = async (item: Item, index: number) => {
    let name: string
    try {
      const value = await new Promise<string>((resolve, reject) => {
        prompt({
          description: t('user.renameClosetItem'),
          confirmText: t('user.renameItem'),
          cancelText: t('general.cancel'),
          onConfirm: (value) => {
            if (!value) {
              alert({
                description: t('skinlib.emptyNewTextureName'),
              })
              return false
            }
            resolve(value)
            return true
          },
          onCancel: reject,
          onClose: reject,
        })
      })
      name = value
    } catch {
      return
    }

    const { code, message } = await fetch.put<fetch.ResponseBody>(
      urls.user.closet.rename(item.tid),
      { name },
    )
    if (code === 0) {
      snackbar({ message, placement: 'top', closeable: true })
      setItems((items) => {
        items[index] = { ...item, pivot: { ...item.pivot, item_name: name } }
        return items.slice()
      })
    } else {
      snackbar({ message, placement: 'top' })
    }
  }

  const removeItem = async (item: Item) => {
    const { tid } = item
    const ok = await removeClosetItem(tid)
    if (ok) {
      setItems((items) => items.filter((item) => item.tid !== tid))
    }
  }

  const applyToPlayer = () => {
    if (!skin && !cape) {
      snackbar({
        message: t('user.emptySelectedTexture'),
        placement: 'top',
      })
      return
    }
    setShowModalApply(true)
  }

  return (
    <>
      <mdui-card ref={containerRef} class="md-card mdui-prose">
        <mdui-tabs value="tab-skin">
          <mdui-tab value="tab-skin" onClick={switchCategoryToSkin}>
            {t('general.skin')}
          </mdui-tab>
          <mdui-tab value="tab-cape" onClick={switchCategoryToCape}>
            {t('general.cape')}
          </mdui-tab>
          <mdui-tab-panel slot="panel" value="tab-skin">
            {isLoading ? (
              <div className="d-flex flex-wrap">
                {new Array(perPageRef.current).fill(null).map((_, i) => (
                  <LoadingClosetItem key={i} />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center p-3">
                {search ? (
                  t('general.noResult')
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t('user.emptyClosetMsg', {
                        url: `${blessing.base_url}/skinlib?filter=${category}`,
                      }),
                    }}
                  ></span>
                )}
              </div>
            ) : (
              <div className="d-flex flex-wrap">
                {items.map((item, i) => (
                  <ClosetItem
                    key={item.tid}
                    item={item}
                    selected={isSelected(item)}
                    onClick={handleSelect}
                    onRename={() => renameItem(item, i)}
                    onRemove={() => removeItem(item)}
                  />
                ))}
              </div>
            )}
          </mdui-tab-panel>
          <mdui-tab-panel slot="panel" value="tab-cape">
            {isLoading ? (
              <div className="d-flex flex-wrap">
                {new Array(perPageRef.current).fill(null).map((_, i) => (
                  <LoadingClosetItem key={i} />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center p-3">
                {search ? (
                  t('general.noResult')
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t('user.emptyClosetMsg', {
                        url: `${blessing.base_url}/skinlib?filter=${category}`,
                      }),
                    }}
                  ></span>
                )}
              </div>
            ) : (
              <div className="d-flex flex-wrap">
                {items.map((item, i) => (
                  <ClosetItem
                    key={item.tid}
                    item={item}
                    selected={isSelected(item)}
                    onClick={handleSelect}
                    onRename={() => renameItem(item, i)}
                    onRemove={() => removeItem(item)}
                  />
                ))}
              </div>
            )}
          </mdui-tab-panel>
        </mdui-tabs>
        <footer>
          <div style={{ marginLeft: 'auto', width: 'fit-content' }}>
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </div>
        </footer>
      </mdui-card>
      <Previewer
        skin={skin?.hash}
        cape={cape?.hash}
        isAlex={skin?.type === TextureType.Alex}
      >
        <mdui-button onClick={applyToPlayer}>{t('user.useAs')}</mdui-button>
        <mdui-divider vertical class="md-br" />
        <mdui-button variant="outlined" onClick={resetSelected}>
          {t('user.resetSelected')}
        </mdui-button>
      </Previewer>
      <ModalApply
        show={showModalApply}
        canAdd
        skin={skin?.tid}
        cape={cape?.tid}
        onClose={() => setShowModalApply(false)}
      />
    </>
  )
}

export default hot(Closet)

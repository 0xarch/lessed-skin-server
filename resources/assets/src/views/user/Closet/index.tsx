import React, { useState, useEffect, useRef } from 'react'
import { hot } from 'react-hot-loader/root'
import debounce from 'lodash.debounce'
import useEmitMounted from '@/scripts/hooks/useEmitMounted'
import { t } from '@/scripts/i18n'
import * as fetch from '@/scripts/net'
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
import Divider from '@/components/mdui/divider'
import Card from '@/components/mdui/card'
import Dialog from '@/scripts/dialog'
import { toast } from '@/scripts/notify'

type Category = 'skin' | 'cape'

const Closet: React.FC = () => {
  // const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState<Category>('skin')
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [skin, setSkin] = useState<Texture | null>(null)
  const [cape, setCape] = useState<Texture | null>(null)
  const [showModalApply, setShowModalApply] = useState(false)
  const perPageRef = useRef(8)
  const [isSkinLoaded, setIsSkinLoaded] = useState(false)
  const [isCapeLoaded, setIsCapeLoaded] = useState(false)
  const [skinItems, setSkinItems] = useState<Item[]>([])
  const [capeItems, setCapeItems] = useState<Item[]>([])

  useEmitMounted()

  useEffect(() => {
    const getItems = async (category: Category) => {
      const fetchData = async () =>
        await fetch.get<Paginator<Item>>(urls.user.closet.list(), {
          category,
          q: query,
          page,
          perPage: perPageRef.current,
        })
      if (category === 'skin' && !isSkinLoaded) {
        const { data, last_page } = await fetchData()
        setSkinItems(data)
        setTotalPages(last_page)
        setIsSkinLoaded(true)
        console.log(data)
      } else if (category === 'cape' && !isCapeLoaded) {
        const { data, last_page } = await fetchData()
        setCapeItems(data)
        setTotalPages(last_page)
        setIsCapeLoaded(true)
        console.log(data)
      }
    }
    getItems(category)
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
    [setQuery],
  )

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearch(value)
    debouncedSetQuery
  }

  const handlePageChange = (page: number) => {
    setPage(page)
    ;(category === 'skin' ? setIsSkinLoaded : setIsCapeLoaded)(false)
  }

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
      const value = await Dialog.prompt({
        description: t('user.renameClosetItem'),
        confirmText: t('user.renameItem'),
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
      toast.success(message)
      ;(category === 'skin' ? setSkinItems : setCapeItems)((items) => {
        items[index] = { ...item, pivot: { ...item.pivot, item_name: name } }
        return items.slice()
      })
    } else {
      toast.error(message)
    }
  }

  const removeItem = async (item: Item) => {
    const { tid } = item
    const ok = await removeClosetItem(tid)
    if (ok) {
      ;(category === 'skin' ? setSkinItems : setCapeItems)((items) =>
        items.filter((item) => item.tid !== tid),
      )
    }
  }

  const applyToPlayer = () => {
    if (!skin && !cape) {
      toast.success(t('user.emptySelectedTexture'))
      return
    }
    setShowModalApply(true)
  }

  return (
    <>
      <Card className="md-tab-card mdui-prose">
        <mdui-text-field type="search" onInput={handleSearch} />
        <mdui-tabs value="tab-skin">
          <mdui-tab value="tab-skin" onClick={switchCategoryToSkin}>
            {t('general.skin')}
          </mdui-tab>
          <mdui-tab value="tab-cape" onClick={switchCategoryToCape}>
            {t('general.cape')}
          </mdui-tab>
          <mdui-tab-panel slot="panel" value="tab-skin">
            {!isSkinLoaded ? (
              <div className="d-flex flex-wrap">
                {new Array(perPageRef.current).fill(null).map((_, i) => (
                  <LoadingClosetItem key={i} />
                ))}
              </div>
            ) : skinItems.length === 0 ? (
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
              <div
                className="d-flex flex-wrap"
                style={{ padding: '1rem', gap: '1rem' }}
              >
                {skinItems.map((item, i) => (
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
            {!isCapeLoaded ? (
              <div className="d-flex flex-wrap">
                {new Array(perPageRef.current).fill(null).map((_, i) => (
                  <LoadingClosetItem key={i} />
                ))}
              </div>
            ) : capeItems.length === 0 ? (
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
              <div className="d-flex flex-wrap md-card">
                {capeItems.map((item, i) => (
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
      </Card>
      <Previewer
        skin={skin?.hash}
        cape={cape?.hash}
        isAlex={skin?.type === TextureType.Alex}
      >
        <mdui-button onClick={applyToPlayer}>{t('user.useAs')}</mdui-button>
        <Divider />
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

import {FieldMapper, ImageShopAsset} from '../types'
import {AssetFromSource} from 'sanity'

export const imageShopAssetToSanityAsset = (
  imageShopData: ImageShopAsset,
  resolvedLanguage: string,
  fieldMapper?: FieldMapper,
  documentTitle?: string,
): AssetFromSource | null => {
  // Make a check, is this even from imageshop ? Should have .documentId and parsed the first part as json.
  if (!imageShopData || !imageShopData.documentId) {
    return null
  }

  const textObject = imageShopData?.text[resolvedLanguage] || {}
  const assetDocumentProps: any = {
    _type: 'sanity.imageAsset',
    source: {
      id: imageShopData.documentId,
      name: `imageshop`,
    },
    texts: imageShopData.text,
  }

  if (documentTitle) {
    assetDocumentProps.title = documentTitle
  }
  if (textObject?.title) {
    assetDocumentProps.title = textObject.title
  }
  if (textObject?.description) {
    assetDocumentProps.description = textObject.description
  }
  if (textObject?.credits) {
    assetDocumentProps.creditLine = textObject.credits
  }
  const asset: AssetFromSource = {
    kind: 'url',
    value: imageShopData.image.file,
    assetDocumentProps: fieldMapper
      ? fieldMapper(assetDocumentProps, imageShopData)
      : assetDocumentProps,
  }
  return asset
}

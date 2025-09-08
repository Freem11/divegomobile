import React, { useState } from 'react'
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { moderateScale } from 'react-native-size-matters'
import { ImagePickerAsset } from 'expo-image-picker'
import { useTranslation } from 'react-i18next'

import { multiImageHandler } from '../../imageUploadHelpers'
import { PhotoUpload } from './PhotoUpload'
import Icon from "../../../../icons/Icon";
import { colors } from '../../../styles'
import { Form } from '../form'
import * as S from '../styles'


interface Step3Props {
  control: Control<Form, any, Form>
  setValue: UseFormSetValue<Form>
  watch: UseFormWatch<Form>
  errors: FieldErrors<Form>
}

export const Step3: React.FC<Step3Props> = ({
  control,
  setValue,
  watch,
  errors,
}) => {
  const { t } = useTranslation()
  const [images, setImages] = useState([])

  const handleSelectImages = async() => {
    try {
      const result = await multiImageHandler()
      if (result?.assets?.[0]?.uri) {
        handlePreviewImages(result?.assets)
      }
    } catch (e: any) {
      console.log('Image selection cancelled', e.message)
    }
  }

  const handlePreviewImages = async(pictures: ImagePickerAsset[]) => {
    const newPicArray = pictures.map((picture) => ( picture.uri ))
    setImages((prevImages) => [...prevImages, ...newPicArray])

    const currentFormPhotos = watch('Photos')
    setValue('Photos', [...currentFormPhotos, ...newPicArray])
  }

  const handleRemovePhoto = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove)
    setImages(updatedImages)
    setValue('Photos', updatedImages)
  }

  const imagesArray = []
  images.forEach((image) => {
    imagesArray.push({ photofile: image })
  })

  return (
    <S.InputGroupContainer>
      <S.Title>{t('DiveSiteReviewer.step3Title')}</S.Title>
      <S.Subtitle>{t('DiveSiteReviewer.step3Description')}</S.Subtitle>


      <S.DescriptionBox>
        <Controller
          control={control}
          name={'Description'}
          render={({ field: { onChange, value } }) => (
            <S.MultilineTextInput
              multiline
              error={errors.Description}
              placeholderTextColor={colors.neutralGrey}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </S.DescriptionBox>

      <S.Title>{t('DiveSiteReviewer.addPhotos')}</S.Title>

      {images && images.length > 0 ? (
        <PhotoUpload
          items={imagesArray}
          onAddSighting={handleSelectImages}
          onRemovePhoto={handleRemovePhoto}
        />
      ) : (
        <S.EmptyStateContainer onPress={handleSelectImages}>
          <Icon
            name={'camera-plus'}
            color={colors.borderActive}
            width={moderateScale(40)}
            height={moderateScale(40)}
          />
        </S.EmptyStateContainer>
      )}
    </S.InputGroupContainer>
  )
}

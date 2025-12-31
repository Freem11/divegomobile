import React, { useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  View,
  Text,
  StyleSheet,
  ImageSourcePropType,
  Platform
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import noImage from "../png/NoImage.png";
import ParallaxDrawer from "../reusables/parallaxDrawer";
import { useAppNavigation } from "../mapPage/types";
import { getPhotoByID } from "../../supabaseCalls/seaLifePhotoCalls/gets";
import { cloudflareBucketUrl } from "../globalVariables";
import ButtonIcon from "../reusables/buttonIcon-new";
import { activeFonts, colors } from "../styles";
import AvatarTextInputField from "../authentication/utils/textInputWithAvatar";
import { useUserProfile } from "../../store/user/useUserProfile";
import fallbackAvatar from "../../assets/icon.png";
import { grabPhotoCommentsByPicId, insertPhotoComment } from "../../supabaseCalls/photoCommentSupabaseCalls";

import PhotoCommentsScreen from "./photoCommentsScreen";

type PhotoCommentsParallaxProps = {
  id: number;
};

export interface CommentItem {
  id: number;
  replied_to: number | null;
  content: string;
  user_id: string;
}

type ReplyToState = [string, string] | null;

export default function PhotoCommentsParallax({ id }: PhotoCommentsParallaxProps) {
  const { userProfile } = useUserProfile();
  const insets = useSafeAreaInsets();

  const fileName = userProfile?.profilePhoto?.split("/").pop();
  const remoteUri = `${cloudflareBucketUrl}${fileName}`;
  const avatarSource: ImageSourcePropType = fileName ? { uri: remoteUri } : fallbackAvatar;

  const [isClearOn, setIsClearOn] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");
  const [listOfComments, setListOfComments] = useState<CommentItem[] | null>(null);

  const contentScrollY = useSharedValue(0);
  const { t } = useTranslation();

  const navigation = useAppNavigation();
  const [headerUri, setHeaderUri] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<ReplyToState>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const pic = await getPhotoByID(id);
      const picFileName = pic?.[0]?.photoFile?.split("/")?.pop();
      const uri = picFileName ? `${cloudflareBucketUrl}${picFileName}` : null;
      if (isMounted) setHeaderUri(uri);
    };
    load();
    return () => { isMounted = false; };
  }, [id]);

  const onClose = () => navigation.goBack();
  const onNavigate = () => Keyboard.dismiss();

  const handleChange = (text: string): void => {
    if (isClearOn) setIsClearOn(false);
    setCommentContent(text);
  };

  useEffect(() => {
    getAllPictureComments(id);
  }, [id]);

  const getAllPictureComments = async (picId: number): Promise<void> => {
    const picComments = await grabPhotoCommentsByPicId(picId);
    setListOfComments(picComments);
  };

  const handleCommentInsert = async (): Promise<void> => {
    try {
      let userIdentity: string | null = null;
      if (replyTo) userIdentity = replyTo[1];
      if (!commentContent || commentContent.trim() === "") return;

      const finalContent = replyTo ? `@${replyTo[0]} - ${commentContent}` : commentContent;
      setCommentContent("");
      setReplyTo(null);

      await insertPhotoComment(userProfile.UserID, id, finalContent, userIdentity);
      await getAllPictureComments(id);
      Keyboard.dismiss();
    } catch (e) {
      console.log("insert comment error:", e);
    }
  };

  const headerImage = useMemo(() => {
    return headerUri ? { uri: headerUri } : noImage;
  }, [headerUri]);

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={{ flex: 1, backgroundColor: colors.themeWhite }}>
        <ParallaxDrawer
          headerImage={headerImage}
          onClose={onClose}
          onMapFlip={onNavigate}
          isMyShop={false}
          contentScrollY={contentScrollY}
        >
          <PhotoCommentsScreen
            id={id}
            contentScrollY={contentScrollY}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            listOfComments={listOfComments}
            insets={insets}
          />
        </ParallaxDrawer>
      </View>

      <View
        style={[
          styles.commentEntryContainer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : moderateScale(15) }
        ]}
      >
        {replyTo && (
          <View style={styles.replyLine}>
            <Text style={styles.userTxt}>@{replyTo[0]}</Text>
            <ButtonIcon
              icon="close"
              onPress={() => setReplyTo(null)}
              size={15}
              fillColor={colors.darkGrey}
              style={{ marginLeft: moderateScale(5), marginRight: 0, width: moderateScale(25), height: moderateScale(25), backgroundColor: "transparent" }}
            />
          </View>
        )}

        <View style={styles.replyBox}>
          <AvatarTextInputField
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            avatarSource={avatarSource}
            inputValue={commentContent}
            placeHolderText={t("Comments.blowBubbles")}
            onChangeText={handleChange}
            handleClear={handleCommentInsert}
          />
        </View>
      </View>
    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.themeWhite,
  },
  commentEntryContainer: {
    width: "100%",
    backgroundColor: colors.themeWhite,
    paddingHorizontal: moderateScale(12),
    paddingTop: moderateScale(10),
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  replyBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  replyLine: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lighterBlue,
    alignSelf: "flex-start",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(5),
    marginBottom: moderateScale(8),
  },
  userTxt: {
    fontFamily: activeFonts.Thin,
    fontSize: moderateScale(14),
    color: colors.themeBlack,
  },
});
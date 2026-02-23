import { Image } from 'expo-image';
import { Trans, useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  const { t } = useTranslation();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          {t('ui.explore.title')}
        </ThemedText>
      </ThemedView>
      <ThemedText>{t('ui.explore.intro')}</ThemedText>
      <Collapsible title={t('ui.explore.fileRoutingTitle')}>
        <ThemedText>
          <Trans
            i18nKey="ui.explore.fileRoutingBody"
            components={{
              code: <ThemedText type="defaultSemiBold" />,
            }}
          />
        </ThemedText>
        <ThemedText>
          <Trans
            i18nKey="ui.explore.layoutBody"
            components={{
              code: <ThemedText type="defaultSemiBold" />,
            }}
          />
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">{t('ui.explore.learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('ui.explore.supportTitle')}>
        <ThemedText>
          <Trans
            i18nKey="ui.explore.supportBody"
            components={{
              code: <ThemedText type="defaultSemiBold" />,
            }}
          />
        </ThemedText>
      </Collapsible>
      <Collapsible title={t('ui.explore.imagesTitle')}>
        <ThemedText>
          <Trans
            i18nKey="ui.explore.imagesBody"
            components={{
              code: <ThemedText type="defaultSemiBold" />,
            }}
          />
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">{t('ui.explore.learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('ui.explore.themeTitle')}>
        <ThemedText>
          <Trans
            i18nKey="ui.explore.themeBody"
            components={{
              code: <ThemedText type="defaultSemiBold" />,
            }}
          />
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">{t('ui.explore.learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('ui.explore.animationsTitle')}>
        <ThemedText>
          <Trans
            i18nKey="ui.explore.animationsBody"
            components={{
              code: <ThemedText type="defaultSemiBold" />,
            }}
          />
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              <Trans
                i18nKey="ui.explore.parallaxBody"
                components={{
                  code: <ThemedText type="defaultSemiBold" />,
                }}
              />
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

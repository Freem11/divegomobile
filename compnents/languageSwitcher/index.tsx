import React from 'react';
import { View, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { availableLanguages, setLanguage } from "../../i18n";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            {Object.entries(availableLanguages).map(([key, label]) => (
                <View key={key} style={{ marginHorizontal: 5 }}>
                    <Button
                        title={label}
                        onPress={() => setLanguage(key)}
                        disabled={i18n.language === key}
                    />
                </View>
            ))}
        </View>
    );
};

export default LanguageSwitcher;

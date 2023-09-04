import * as React from 'react';
import { Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { inject, observer } from 'mobx-react';

import DropdownSetting from '../../components/DropdownSetting';
import Header from '../../components/Header';
import Screen from '../../components/Screen';
import Switch from '../../components/Switch';

import SettingsStore, { MEMPOOL_RATES_KEYS } from '../../stores/SettingsStore';

import { localeString } from '../../utils/LocaleUtils';
import { themeColor } from '../../utils/ThemeUtils';

import TextInput from '../../components/TextInput';

interface PaymentsSettingsProps {
    navigation: any;
    SettingsStore: SettingsStore;
}

interface PaymentsSettingsState {
    feeLimitMethod: string;
    feeLimit: string;
    feePercentage: string;
    enableMempoolRates: boolean;
    preferredMempoolRate: string;
}

@inject('SettingsStore')
@observer
export default class PaymentsSettings extends React.Component<
    PaymentsSettingsProps,
    PaymentsSettingsState
> {
    state = {
        feeLimitMethod: 'fixed',
        feeLimit: '100',
        feePercentage: '0.5',
        enableMempoolRates: false,
        preferredMempoolRate: 'fastestFee'
    };

    async UNSAFE_componentWillMount() {
        const { SettingsStore } = this.props;
        const { getSettings } = SettingsStore;
        const settings = await getSettings();

        this.setState({
            feeLimitMethod: settings?.payments?.defaultFeeMethod || 'fixed',
            feeLimit: settings?.payments?.defaultFeeFixed || '100',
            feePercentage: settings?.payments?.defaultFeePercentage || '0.5',
            enableMempoolRates: settings?.privacy?.enableMempoolRates || false,
            preferredMempoolRate:
                settings?.payments?.preferredMempoolRate || 'fastestFee'
        });
    }

    renderSeparator = () => (
        <View
            style={{
                height: 1,
                backgroundColor: themeColor('separator')
            }}
        />
    );

    render() {
        const { navigation } = this.props;
        const {
            feeLimit,
            feeLimitMethod,
            feePercentage,
            enableMempoolRates,
            preferredMempoolRate
        } = this.state;
        const { SettingsStore } = this.props;
        const { updateSettings, settings } = SettingsStore;

        return (
            <Screen>
                <Header
                    leftComponent="Back"
                    centerComponent={{
                        text: localeString('views.Settings.Payments.title'),
                        style: {
                            color: themeColor('text'),
                            fontFamily: 'Lato-Regular'
                        }
                    }}
                    navigation={navigation}
                />
                <View
                    style={{
                        paddingLeft: 15,
                        paddingRight: 15
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'Lato-Regular',
                            paddingTop: 5,
                            color: themeColor('text')
                        }}
                    >
                        {`${localeString(
                            'views.Settings.Payments.defaultFeeLimit'
                        )}`}
                    </Text>
                    <View
                        style={{
                            flex: 1,
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            opacity: feeLimitMethod == 'percent' ? 1 : 0.25
                        }}
                    ></View>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '95%'
                        }}
                    >
                        <TextInput
                            style={{
                                width: '50%',
                                opacity: feeLimitMethod == 'fixed' ? 1 : 0.25
                            }}
                            keyboardType="numeric"
                            value={feeLimit}
                            onChangeText={async (text: string) => {
                                this.setState({
                                    feeLimit: text
                                });
                                await updateSettings({
                                    payments: {
                                        defaultFeeMethod: 'fixed',
                                        defaultFeePercentage: feePercentage,
                                        defaultFeeFixed: text,
                                        preferredMempoolRate
                                    }
                                });
                            }}
                            onPressIn={() =>
                                this.setState({
                                    feeLimitMethod: 'fixed'
                                })
                            }
                        />
                        <Text
                            style={{
                                fontFamily: 'Lato-Regular',
                                paddingTop: 5,
                                color: themeColor('text'),
                                top: 28,
                                right: 30,
                                opacity: feeLimitMethod == 'fixed' ? 1 : 0.25
                            }}
                        >
                            {`${localeString('general.sats')}`}
                        </Text>
                        <TextInput
                            style={{
                                width: '50%',
                                opacity: feeLimitMethod == 'percent' ? 1 : 0.25
                            }}
                            keyboardType="numeric"
                            value={feePercentage}
                            onChangeText={async (text: string) => {
                                this.setState({
                                    feePercentage: text
                                });
                                await updateSettings({
                                    payments: {
                                        defaultFeeMethod: 'percent',
                                        defaultFeePercentage: text,
                                        defaultFeeFixed: feeLimit,
                                        preferredMempoolRate
                                    }
                                });
                            }}
                            onPressIn={() =>
                                this.setState({
                                    feeLimitMethod: 'percent'
                                })
                            }
                        />
                        <Text
                            style={{
                                fontFamily: 'Lato-Regular',
                                paddingTop: 5,
                                color: themeColor('text'),
                                top: 28,
                                right: 18,
                                opacity: feeLimitMethod == 'percent' ? 1 : 0.25
                            }}
                        >
                            {'%'}
                        </Text>
                    </View>
                    <ListItem
                        containerStyle={{
                            borderBottomWidth: 0,
                            backgroundColor: 'transparent'
                        }}
                    >
                        <ListItem.Title
                            style={{
                                color: themeColor('secondaryText'),
                                fontFamily: 'Lato-Regular',
                                left: -10
                            }}
                        >
                            {localeString(
                                'views.Settings.Privacy.enableMempoolRates'
                            )}
                        </ListItem.Title>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-end'
                            }}
                        >
                            <Switch
                                value={enableMempoolRates}
                                onValueChange={async () => {
                                    this.setState({
                                        enableMempoolRates: !enableMempoolRates
                                    });
                                    await updateSettings({
                                        privacy: {
                                            defaultBlockExplorer:
                                                settings?.privacy
                                                    ?.defaultBlockExplorer,
                                            customBlockExplorer:
                                                settings?.privacy
                                                    ?.customBlockExplorer,
                                            clipboard:
                                                settings?.privacy?.clipboard,
                                            lurkerMode:
                                                settings?.privacy?.lurkerMode,
                                            enableMempoolRates:
                                                !enableMempoolRates
                                        }
                                    });
                                }}
                            />
                        </View>
                    </ListItem>
                    <DropdownSetting
                        title={localeString(
                            'views.Settings.Payments.preferredMempoolRate'
                        )}
                        selectedValue={preferredMempoolRate}
                        onValueChange={async (value: string) => {
                            this.setState({
                                preferredMempoolRate: value
                            });
                            await updateSettings({
                                payments: {
                                    defaultFeeMethod: feeLimitMethod,
                                    defaultFeePercentage: feePercentage,
                                    defaultFeeFixed: feeLimit,
                                    preferredMempoolRate: value
                                }
                            });
                        }}
                        values={MEMPOOL_RATES_KEYS}
                        disabled={!enableMempoolRates}
                    />
                </View>
            </Screen>
        );
    }
}

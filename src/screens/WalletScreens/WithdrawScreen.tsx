import React from "react";
import asRoute from "hoc/asRoute";
import KeyboardAwareView from "@layouts/KeyboardAwareView/KeyboardAwareView";
import { Text, VStack } from "native-base";
import CustomInput from "@components/CustomInput/CustomInput";
import { transferAccountData } from "@appData/myWallet";
import TransferAccountCard from "@layouts/TransferAccountCard/TransferAccountCard";
import TextButton from "@components/TextButton/TextButton";
import { ITransferAccountCard } from "@layouts/TransferAccountCard/TransferAccountCard.types";
import useNavigate from "@hooks/useNavigate";
import colors from "@theme/colors";

function WithdrawScreen() {
    const navigate = useNavigate();

    const handleClickOnAccountItem = ({ transferAccountItem }: ITransferAccountCard) => {
        const { currency, amount, name } = transferAccountItem;
        navigate('withdrawSummaryScreen', { currency, amount, transferTo: name });
    }

    const handleAddNewAccount = () => {
        navigate('addNewAccountScreen');
    }
    return (
        <KeyboardAwareView>
            <VStack px="20px">
                <CustomInput title="Amount" placeholder="Enter amount" />
                <Text color={colors.black} variant="h2" my="20px">Transfer To</Text>
                <VStack bg="#ffffff" borderRadius="8px" p="12px">
                    {transferAccountData.map((transferAccountItem, index) => <TransferAccountCard onPress={() => handleClickOnAccountItem({ transferAccountItem })} transferAccountItem={transferAccountItem} key={index} />)}
                    <TextButton onPress={handleAddNewAccount} my="10px" title="Add account" />
                </VStack>
            </VStack>
        </KeyboardAwareView>
    );
}

const withdrawScreen = asRoute(WithdrawScreen, 'withdrawScreen', {
    title: 'Withdraw',
});

export default withdrawScreen;

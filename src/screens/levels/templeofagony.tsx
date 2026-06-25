import React, { useState } from 'react';
import { View, StyleSheet, Image, BackHandler, TouchableWithoutFeedback } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { GodofAgonyIcon } from '../../components/SvgExporter';
import IconButton from '../../components/functions/iconbutton';
import Inventory from '../../components/inventory';
import { font } from '../../components/functions/fontsize';
import ConversationOffChoiceModal from '../../components/modal/conversationoffchoicemodal';
import ConversationOffModal from '../../components/modal/conversationoffmodal';
import { godofagonyChoice } from '../../components/functions/conversationsoffchoice';
import { conversationsoff } from '../../components/functions/conversationsoff';
import { healMaiaFull, incrementMaiaMana, decrementMaiaCurrentHealth } from '../../redux/maiaSlice';

const TempleOfAgonyScreen = () => {
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => backHandler.remove();
    }, [])
  );

  const dispatch = useDispatch();
  const maiaCurrentHealth = useSelector((state: any) => state.maia.maiacurrenthealth);

  const [choiceModalVisible, setChoiceModalVisible] = useState(false);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [blocking, setBlocking] = useState(false);

  const closeChoiceModal = () => {
    setChoiceModalVisible(false);
    if (maiaCurrentHealth === 1) {
      setBlocking(true);
      setTimeout(() => {
        setBlocking(false);
        setDeclineModalVisible(true);
      }, 10);
    }
  };

  const handleMana = () => {
    if (maiaCurrentHealth > 1) {
      dispatch(incrementMaiaMana(1));
      dispatch(decrementMaiaCurrentHealth(maiaCurrentHealth - 1));
    }
  };

  const handleLife = () => {
    dispatch(healMaiaFull());
  };

  const conversation = godofagonyChoice(handleMana, handleLife);

  return (
    <View style={styles.container}>
      <Image source={require('../../images/templeofagony.jpg')} style={styles.backgroundImage} resizeMode="cover" />

      <IconButton
        Icon={GodofAgonyIcon}
        width={font(180)}
        height={font(270)}
        style={{ top: '40%', left: '30%' }}
        onPress={() => setChoiceModalVisible(true)}
      />

      <Inventory
        highlightedSquares={[7]}
        whiteSquare={7}
        minisSquares={18}
        sSquares={55}
        tSquares={9}
        mSquares={3}
        text="Templo de la Agonia"
      />

      {blocking && (
        <TouchableWithoutFeedback>
          <View style={styles.blocker} />
        </TouchableWithoutFeedback>
      )}

      <ConversationOffChoiceModal
        visible={choiceModalVisible}
        onClose={closeChoiceModal}
        conversation={conversation}
        allowClosing={true}
      />

      <ConversationOffModal
        visible={declineModalVisible}
        onClose={() => setDeclineModalVisible(false)}
        conversation={conversationsoff.agonydeclinemana}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  blocker: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
});

export default TempleOfAgonyScreen;

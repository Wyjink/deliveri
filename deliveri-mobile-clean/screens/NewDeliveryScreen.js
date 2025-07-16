import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Modal, Alert, Platform, SafeAreaView } from 'react-native';
import { List, Chip, Button, useTheme, Divider, Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { fetchTransportModels, createDelivery } from '../api';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewDeliveryScreen({ token }) {
  const [status] = useState('В ожидании');
  const [isWorking] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [number, setNumber] = useState('');
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [creating, setCreating] = useState(false);
  const [travelTimeModal, setTravelTimeModal] = useState(false);
  const [travelMinutes, setTravelMinutes] = useState(0); // время в пути в минутах
  const [travelInput, setTravelInput] = useState('0:00');

  // Новое: состояния для дат и времени отправки/доставки
  const [sendDate, setSendDate] = useState(new Date());
  const [showSendDate, setShowSendDate] = useState(false);
  const [showSendTime, setShowSendTime] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showDeliveryDate, setShowDeliveryDate] = useState(false);
  const [showDeliveryTime, setShowDeliveryTime] = useState(false);

  // Новое: состояния для дистанции
  const [distanceModal, setDistanceModal] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  useEffect(() => {
    async function loadModels() {
      setLoadingModels(true);
      try {
        const data = await fetchTransportModels(token);
        setModels(data);
      } catch (e) {
        setModels([]);
      } finally {
        setLoadingModels(false);
      }
    }
    loadModels();
  }, [token]);

  async function handleCreate() {
    setCreating(true);
    try {
      await createDelivery({ model: selectedModel, number }, token);
      Alert.alert('Успех', 'Доставка создана!');
      setSelectedModel('');
      setNumber('');
    } catch (e) {
      Alert.alert('Ошибка', e.message || 'Не удалось создать доставку');
    } finally {
      setCreating(false);
    }
  }

  // Функция для форматирования минут в строку "ч:мм"
  function formatMinutes(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}:${m.toString().padStart(2, '0')}`;
  }

  // Функция для обработки ввода с цифровой клавиатуры
  function handleKeyPress(key) {
    let digits = travelInput.replace(':', '');
    if (key === 'del') {
      digits = digits.slice(0, -1);
    } else {
      if (digits.length < 3) digits += key;
    }
    while (digits.length < 3) digits = '0' + digits;
    const h = parseInt(digits.slice(0, digits.length - 2), 10);
    const m = parseInt(digits.slice(-2), 10);
    setTravelInput(`${h}:${m.toString().padStart(2, '0')}`);
    setTravelMinutes(h * 60 + m);
  }

  // Форматирование даты и времени для отображения
  function formatDate(date) {
    return date.toLocaleDateString();
  }
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#181A20' }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text variant="titleLarge" style={styles.header}>Новая доставка</Text>

          <List.Section>
            <List.Subheader style={styles.subheader}>КУРЬЕР</List.Subheader>
            <List.Item
              title="Модель и номер"
              description={selectedModel && number ? `${selectedModel}, №${number}` : ''}
              left={props => <List.Icon {...props} icon="car" color="#fff" />}
              right={props => <List.Icon {...props} icon="chevron-right" color="#888" />}
              style={styles.listItem}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDesc}
              onPress={() => setModalVisible(true)}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Время в пути"
              description={formatMinutes(travelMinutes)}
              left={props => <List.Icon {...props} icon="clock-outline" color="#fff" />}
              right={props => <List.Icon {...props} icon="chevron-right" color="#888" />}
              style={styles.listItem}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDesc}
              onPress={() => setTravelTimeModal(true)}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Дистанция"
              description={fromLocation && toLocation ? `${fromLocation} → ${toLocation}` : 'Откуда\nКуда'}
              left={props => <List.Icon {...props} icon="map-marker-distance" color="#fff" />}
              right={props => <List.Icon {...props} icon="chevron-right" color="#888" />}
              style={styles.listItem}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDesc}
              onPress={() => setDistanceModal(true)}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Медиафайл"
              left={props => <List.Icon {...props} icon="file-upload-outline" color="#fff" />}
              right={props => <List.Icon {...props} icon="chevron-right" color="#888" />}
              style={styles.listItem}
              titleStyle={styles.listTitle}
            />
          </List.Section>

          <List.Section>
            <List.Subheader style={styles.subheader}>СТАТУС</List.Subheader>
            <List.Item
              title="Услуга"
              left={props => <List.Icon {...props} icon="information-outline" color="#fff" />}
              right={props => <List.Icon {...props} icon="chevron-right" color="#888" />}
              style={styles.listItem}
              titleStyle={styles.listTitle}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Статус доставки"
              right={props => (
                <Chip style={styles.statusChip} textStyle={{ color: '#fff' }}>
                  В ожидании
                </Chip>
              )}
              left={props => <List.Icon {...props} icon="progress-clock" color="#fff" />}
              style={styles.listItem}
              titleStyle={styles.listTitle}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Упаковка"
              left={props => <List.Icon {...props} icon="cube-outline" color="#fff" />}
              right={props => <List.Icon {...props} icon="chevron-right" color="#888" />}
              style={styles.listItem}
              titleStyle={styles.listTitle}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Тех. исправность"
              right={props => (
                <Chip style={styles.okChip} textStyle={{ color: '#fff' }}>
                  Исправно
                </Chip>
              )}
              left={props => <List.Icon {...props} icon="cog-outline" color="#fff" />}
              style={styles.listItem}
              titleStyle={styles.listTitle}
            />
          </List.Section>

          <Button mode="contained" style={styles.createBtn} onPress={handleCreate} disabled={!selectedModel || !number || creating} loading={creating}>
            Создать
          </Button>
        </ScrollView>

        {/* Модалка для выбора/ввода модели и номера */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#23242A', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
              <View style={{ alignItems: 'center', marginBottom: 12 }}>
                <View style={{ width: 40, height: 4, backgroundColor: '#444', borderRadius: 2 }} />
              </View>
              <Text style={{ color: '#fff', fontSize: 18, marginBottom: 12 }}>Модель и номер</Text>
              <Text style={{ color: '#aaa', marginBottom: 8 }}>МОДЕЛЬ</Text>
              {loadingModels ? <ActivityIndicator /> : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                  {models.map(m => (
                    <Chip
                      key={m}
                      selected={selectedModel === m}
                      onPress={() => setSelectedModel(m)}
                      style={{
                        marginRight: 8, marginBottom: 8,
                        backgroundColor: selectedModel === m ? '#444' : '#181A20',
                      }}
                      textStyle={{ color: '#fff' }}
                    >
                      {m}
                    </Chip>
                  ))}
                </View>
              )}
              <TextInput
                label="Или введите модель"
                value={selectedModel}
                onChangeText={setSelectedModel}
                style={{ marginBottom: 12, backgroundColor: '#181A20' }}
                theme={{ colors: { text: '#fff', placeholder: '#aaa' } }}
              />
              <Text style={{ color: '#aaa', marginBottom: 8 }}>НОМЕР</Text>
              <TextInput
                label="Номер"
                value={number}
                onChangeText={setNumber}
                keyboardType="numeric"
                style={{ marginBottom: 16, backgroundColor: '#181A20' }}
                theme={{ colors: { text: '#fff', placeholder: '#aaa' } }}
              />
              <Button mode="contained" onPress={() => setModalVisible(false)}>
                Готово
              </Button>
            </View>
          </View>
        </Modal>
        {/* Модалка для выбора времени в пути, даты и времени отправки/доставки */}
        <Modal
          visible={travelTimeModal}
          animationType="slide"
          transparent
          onRequestClose={() => setTravelTimeModal(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#23242A', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
              <Text style={{ color: '#fff', fontSize: 18, marginBottom: 12 }}>Время в пути</Text>
              {/* Блок отправки */}
              <Text style={styles.label}>ОТПРАВКА</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>Дата</Text>
                  <Button mode="outlined" onPress={() => setShowSendDate(true)} style={styles.dateBtn}>
                    {formatDate(sendDate)}
                  </Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Время</Text>
                  <Button mode="outlined" onPress={() => setShowSendTime(true)} style={styles.dateBtn}>
                    {formatTime(sendDate)}
                  </Button>
                </View>
              </View>
              {/* Блок доставки */}
              <Text style={styles.label}>ДОСТАВКА</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>Дата</Text>
                  <Button mode="outlined" onPress={() => setShowDeliveryDate(true)} style={styles.dateBtn}>
                    {formatDate(deliveryDate)}
                  </Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Время</Text>
                  <Button mode="outlined" onPress={() => setShowDeliveryTime(true)} style={styles.dateBtn}>
                    {formatTime(deliveryDate)}
                  </Button>
                </View>
              </View>
              {/* Время в пути */}
             
              <Button mode="contained" style={{ marginTop: 16 }} onPress={() => setTravelTimeModal(false)}>
                Готово
              </Button>
            </View>
          </View>
          {/* DateTimePickers */}
          {showSendDate && (
            <DateTimePicker
              value={sendDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowSendDate(false);
                if (selectedDate) setSendDate(new Date(selectedDate.setHours(sendDate.getHours(), sendDate.getMinutes())));
              }}
            />
          )}
          {showSendTime && (
            <DateTimePicker
              value={sendDate}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowSendTime(false);
                if (selectedDate) setSendDate(new Date(sendDate.setHours(selectedDate.getHours(), selectedDate.getMinutes())));
              }}
            />
          )}
          {showDeliveryDate && (
            <DateTimePicker
              value={deliveryDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDeliveryDate(false);
                if (selectedDate) setDeliveryDate(new Date(selectedDate.setHours(deliveryDate.getHours(), deliveryDate.getMinutes())));
              }}
            />
          )}
          {showDeliveryTime && (
            <DateTimePicker
              value={deliveryDate}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDeliveryTime(false);
                if (selectedDate) setDeliveryDate(new Date(deliveryDate.setHours(selectedDate.getHours(), selectedDate.getMinutes())));
              }}
            />
          )}
        </Modal>

        {/* Модалка для ввода дистанции */}
        <Modal
          visible={distanceModal}
          animationType="slide"
          transparent
          onRequestClose={() => setDistanceModal(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: '#23242A', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
              <Text style={{ color: '#fff', fontSize: 18, marginBottom: 12 }}>Дистанция</Text>
              <TextInput
                label="Откуда"
                value={fromLocation}
                onChangeText={setFromLocation}
                style={{ marginBottom: 12, backgroundColor: '#181A20' }}
                theme={{ colors: { text: '#fff', placeholder: '#aaa' } }}
              />
              <TextInput
                label="Куда"
                value={toLocation}
                onChangeText={setToLocation}
                style={{ marginBottom: 16, backgroundColor: '#181A20' }}
                theme={{ colors: { text: '#fff', placeholder: '#aaa' } }}
              />
              <Button mode="contained" onPress={() => setDistanceModal(false)}>
                Готово
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    color: '#fff',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  subheader: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 0,
    marginTop: 8,
  },
  listItem: {
    backgroundColor: '#23242A',
    borderRadius: 12,
    marginBottom: 4,
    paddingVertical: 0,
    minHeight: 56,
  },
  listTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listDesc: {
    color: '#aaa',
    fontSize: 13,
  },
  divider: {
    backgroundColor: '#23242A',
    height: 2,
  },
  statusChip: {
    backgroundColor: '#B47A1B',
    marginRight: 8,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  okChip: {
    backgroundColor: '#1B8F3B',
    marginRight: 8,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtn: {
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: '#23242A',
    opacity: 0.5,
  },
  label: {
    color: '#aaa',
    marginBottom: 4,
    marginLeft: 4,
  },
  dateBtn: {
    backgroundColor: '#23242A',
    borderRadius: 8,
    marginBottom: 8,
  },
});
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonList, IonListHeader, IonLabel, IonSearchbar, IonItem, IonSegment, IonSegmentButton, IonGrid, IonRow, IonCol, IonToggle, IonChip } from '@ionic/react';
import React, { useState } from 'react'
import { ROUTES } from '../../../shared/constants/routes';
import { useNavigate } from 'react-router-dom';
import { timeIntervals } from '../../constants/timeIntervals';
import { HourMode, MinuteMode } from '../../assets/svg/SVGcomponent';
import '../../styles/common.scss';
import './styles.scss'

export const OrdersView = () => {
    const navigate = useNavigate();
    const [timeMode, setTimeMode] = useState<'hourMode' | 'minuteMode'>('hourMode');
    const [selectedInterval, setSelectedInterval] = useState<string>('15min');
    const handleTimeModeChange = (value: 'hourMode' | 'minuteMode') => {
        setTimeMode(value);
        setSelectedInterval(timeIntervals[value][0].value);
    };

    const handleItemClick = (path: string) => {
        navigate(path);
    };

    return (
        <IonContent>
          <IonHeader>
            <IonToolbar>
                <IonButtons slot='start'>
                    <IonBackButton text='' defaultHref={ROUTES.MENU} color='medium'></IonBackButton>
                </IonButtons>
              <IonTitle>OrdersView</IonTitle>
            </IonToolbar>
          </IonHeader>
          <div className='ion-padding'>
            <IonGrid>
            <IonRow class="ion-align-items-center">
            <IonCol>
                <IonListHeader>Oct 2 | 06:00 - 07:00</IonListHeader>
            </IonCol>
            <IonCol size='auto'>
            <IonSegment  className='timeMode' value={timeMode} onIonChange={e => handleTimeModeChange(e.detail.value as 'hourMode' | 'minuteMode')}>
                <IonSegmentButton value={'hourMode'}>
                    <img src={HourMode} alt='hour mode' />
                </IonSegmentButton>
                <IonSegmentButton value={'minuteMode'}>
                    <img src={MinuteMode} alt='minute mode' />
                </IonSegmentButton>
            </IonSegment>
            </IonCol>
            </IonRow>
            </IonGrid>
            <div>
            <IonSegment value={selectedInterval} scrollable={false} onIonChange={e => setSelectedInterval(e.detail.value?.toString() || '')}>
                {timeIntervals[timeMode].map(interval => (
                    <IonSegmentButton key={interval.value} value={interval.value}>
                        <IonLabel>{interval.label}</IonLabel>
                    </IonSegmentButton>
                ))}
            </IonSegment>
            </div>
            <div>
            <IonToggle justify="space-between">Show scheduled time</IonToggle>
            <div className='orders-container'>
      <div className='orders'>
        {[...Array(4).keys()].map((index) => (
          <IonChip key={index} color="dark">
            #{45872 + index}
          </IonChip>
        ))}
      </div>
    </div>
            </div>
          </div>
          
        </IonContent>
      );
}
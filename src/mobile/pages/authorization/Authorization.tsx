import { KeyboardEvent, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { authorizationRequest } from '../../api/companyRequest'; 
import FiveS from '../../assets/svg/icon.svg';
import './Authorization.scss';
import {
  IonInput,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonSpinner,
  IonToast,
  IonInputPasswordToggle,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';

export const Authorization = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [correctEmail, setCorrectEmail] = useState(true);
  const [correctPassword, setCorrectPassword] = useState(true);
  const [errorResponse, setErrorResponse] = useState('');
  const [errorPassword, setErrorPassword] = useState(false);
  const [, setCookie] = useCookies(['token']);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (password.length < 20) {
      setCorrectPassword(true);
    } else {
      setCorrectPassword(false);
    }
  }, [password]);
    
  useEffect(() => {
    if (email.length < 25) {
      setCorrectEmail(true);
    } else {
      setCorrectEmail(false);
    }
  }, [email]);

  const post = () => {
    if (password.length > 0) {
      authorizationRequest(window.location.hostname, email, password)
        .then((response) => {
          if (response.status === 200 && response.data.access) {
            setCookie('token', `JWT ${response.data.access}`, { path: '/' });
            navigate('/')
          }
          if (!response.data.access) {
            setErrorResponse('Incorrect email or password. Please, try again.');
          }
        })
        .catch((error) => {
          setErrorResponse(error.message);
        });
    } else {
      setErrorPassword(true);
    }
  };

  const pressEnter = (event: KeyboardEvent<HTMLIonInputElement>) => {
    if (event.key === 'Enter' && correctEmail && correctPassword) {
      post();
    }
  };

  return (
    <IonPage>
      <IonContent className='authorization'>
        <img src={FiveS} alt='logo' className='authorization__logo' />
        <h2 className='authorization__title'>Sign in to 5S Control</h2>
        <div className='authorization__container'>
          <IonItem>
            <IonLabel position='stacked'>User</IonLabel>
            <IonInput
              value={email}
              placeholder='Enter user'
              className='input__wrapper'
              onIonChange={(e) => setEmail(e.detail.value!)}
              onKeyDown={pressEnter}
              required
            />
          </IonItem>
          {!correctEmail && <span className='authorization__error'>Email isn't correct!</span>}
          
          <IonItem>
            <IonLabel position='stacked'>Password</IonLabel>
            <IonInput 
              type='password'
              value={password}
              className='input__wrapper'
              placeholder='Enter password'
              onIonChange={(e) => {
                setPassword(e.detail.value!);
                setErrorPassword(false);
              }}
              onKeyDown={pressEnter}
              required >
                <IonInputPasswordToggle slot='end' color='medium'></IonInputPasswordToggle>
            </IonInput>
          </IonItem>
          {errorResponse && (
            <IonToast
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message={errorResponse}
              duration={2000}
            />
          )}
         {errorResponse && (
          <span className='authorization__error_response'>
            Incorrect email or password. Please, try again.
          </span>
        )}
        {errorPassword && (
          <span className='authorization__error_password'>This field is required.</span>
        )}
          <IonButton className='authorization__button' expand='full' onClick={post} disabled={loading}>
            {loading ? <IonSpinner name='crescent' /> : 'Log In'}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
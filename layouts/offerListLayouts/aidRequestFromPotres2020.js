import styles from './listItemStyles.module.scss'
import { useState } from 'react'
import Moment from 'react-moment'
import { DateRange, Comment } from '@material-ui/icons'
import TextField from '@material-ui/core/TextField'
import { markEntryAsFulfilled } from 'utils/utils'
import Router from 'next/router'
import Link from 'next/link'

export default function AidRequestInList({ data }) {

  const [markFulfilledTriggered, setMarkFulfilledTriggered] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleMarkAsFulfilled = (id) => {
    markEntryAsFulfilled('aid-requests', id)
      .then(response => {
        Router.reload(window.location.pathname);
      })
      .catch(error => {
        console.log('Error marking entry as fulfilled :(', error)
      })
  }

  return (
    <div className={styles.listItemContainerAlert}>
      {markFulfilledTriggered ? (
        <div className={styles.markAsFulfilledContainer}>
          <p>Kako bi osigurali što bolju preglednost sustava, omogućili smo uklanjanje ispunjenih unosa. Kako bi unos označili kao ispunjen, unesite mail adresu koju ste unijeli pri kreiranju. Ukoliko je mail adresa ispravna, prikazati će se gumb za potvrdu.</p>
          <div className={styles.emailInputWrapper}>
            <TextField
              className={styles.inputField}
              label='Kontakt mail adresa'
              placeholder='moj@email.hr'
              helperText='Važno: mail adresa koju ste unijeli pri kreiranju unosa'
              onChange={(event) => setEmailInput(event.target.value)}
              value={emailInput}
              variant='outlined'
              type='email'
              required
            />
          </div>
          <div className={styles.buttonsWrapper}>
            {(emailInput === data.submitter_email) && (
              <button
                className={styles.submitButton}
                onClick={() => handleMarkAsFulfilled(data.id)}
              >
                Označi kao ispunjeno
              </button>
            )}
            <button
              className={styles.cancelButton}
              onClick={() => setMarkFulfilledTriggered(false)}
            >
              Odustani
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.itemHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.typeLabelAlert}>Tražim pomoć!</span>
              <a target='_blank' href={`https://potres2020.openit.hr/posts/${data.id}`}><span className={styles.mainLabel}>{data.location}</span></a>
            </div>
            <div className={styles.headerRight}>
 
            </div>
            </div>
            <Link href={`/trazim-pomoc/${data.id}`}>
              <ul className={styles.meta}>
                <li key='created-at'>
                  <i className={styles.metaIcon}>
                    <DateRange/>
                  </i>
                  <span>
                  <Moment date={data.created_at} format='DD.MM.YYYY, H:mm' />
                  </span>
                </li>
              </ul>
            </Link>
            <div className={styles.descriptionWrapper}>
              {data.description}
              <br></br>
              {data.additionalContent}
            </div>
            <div className={styles.footer}>
              <span className={styles.contactName}>
                Kontakt osoba: {data.contact_name}
              </span>
              <a href={`tel:${data.contact_phone}`}>{data.contact_phone}</a>
              {data.available_on_whatsapp && (
                <span className={styles.whatsappAvailability}>
                  <img src='/icons/whatsapp-icon.svg' alt='available on WhatsApp' />
                  Dostupan/na na WhatsApp
                </span>
              )}
            </div>
        </div>
      )}
    </div>
  )
}
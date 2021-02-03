import Head from 'next/head'
import { fetchQuery } from 'utils/utils'
import { useState } from 'react'
import styles from './index.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import OfferingListItem from 'components/offeringLIstItem'
import AccommodationInList from 'layouts/offerListLayouts/accommodation'
import TransportInList from 'layouts/offerListLayouts/transport'
import AidCollectionInList from 'layouts/offerListLayouts/aidCollection'
import AidRequestInList from 'layouts/offerListLayouts/aidRequest'
import RedirectNotificationModal from 'components/redirectNotificationModal'

export default function Home({ accommodations, aidCollections, transports, aidRequests, itemTags }) {

  const [notificationModalActive, setNotificationModalActive] = useState(false)
  
  const mapItems = [];
  
  if (accommodations) {
    accommodations.forEach(item => {
      mapItems.push({
        type: 'accommodation',
        ...item
      })
    });
  }

  if (aidCollections) {
    aidCollections.forEach(item => {
      mapItems.push({
        type: 'aidCollection',
        ...item
      })
    });
  }

  if (transports) {
    transports.forEach(item => {
      mapItems.push({
        type: 'transport',
        ...item
      })
    });
  }

  if (aidRequests) {
    aidRequests.forEach(item => {
      mapItems.push({
        type: 'aidRequest',
        ...item
      })
    });
  }

  const displayItem = (item) => {
    switch (item.type) {
      case 'accommodation':
        return (
          <AccommodationInList data = {item} />
        )
      case 'transport':
        return (
          <TransportInList data = {item} />
        )
      case 'aidCollection':
        return (
          <AidCollectionInList data = {item} />
        )
      case 'aidRequest':
        return (
          <AidRequestInList data = {item} />
        )
      default:
        break;
    }
  }

  mapItems.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Pomoć žrtvama potresa</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainSiteLayout itemTags = {itemTags}>
        {notificationModalActive && (
          <RedirectNotificationModal dismissFunction={() => setNotificationModalActive(false)} />
        )}

        <LayoutWithSideMap items = {mapItems}>
          <div className={styles.introSection}>
            <h1>Najnoviji unosi:</h1>
            <p>Ova stranica služi kao "oglasna ploča" sa svrhom lakšeg koordiniranja pomoći žrtvama potresa koji je pogodio centralnu Hrvatsku.</p>
            <p>Ispod možete pronaći najnovije unose iz kategorija ponude <strong>prijevoza</strong>, <strong>ponude smještaja</strong>, <strong>lokacija za prikupljanje pomoći</strong>, kao i lokacija gdje je <strong>potrebna pomoć</strong>. Iste možete pronaći i na karti.</p>
            <br />
            <strong>Upute za donatore:</strong>
            <ul>
              <li>Obavezno nazovite tražitelje pomoći za provjeru je li im u međuvremenu pružena pomoć!</li>
              <li>Ukoliko im je u međuvremenu pružena pomoć, ali to nije naznačeno u sustavu, molimo Vas da dodate tu napomenu u komentar.</li>
              <li>Ulogirajte se u aplikaciju i prebacite zahtjev na sebe ako planirate pomoći.</li>
              <li>Status zahtjeva naznačite kao "ispunjeno" nakon što je zahtjev ispunjen!</li>
            </ul>
            <br />
            <strong>Hvala na pomoći ❤️</strong>
          </div>

          {mapItems.map((item, index) => {
            return (
              <OfferingListItem key={`item-${index}`}>
                {displayItem(item)}
              </OfferingListItem>
            )
          })}
        </LayoutWithSideMap>
      </MainSiteLayout>
    </div>
  )
}

export async function getStaticProps() {
  const results = await fetchQuery('data-api/latest');
  return {
    props: {
      accommodations: results.accommodations,
      aidCollections: results.aidCollections,
      transports: results.transports,
      aidRequests: results.aidRequests,
      itemTags: results.itemTags,
    },
    revalidate: 1,
  }
}
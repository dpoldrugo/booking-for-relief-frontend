import React, { useState } from 'react'
import Link from 'next/link'
import Router, { useRouter } from "next/router";
import { signIn, signOut, useSession } from 'next-auth/client'
import TextField from '@material-ui/core/TextField'
import { Search, Menu, Close } from '@material-ui/icons'
import Autocomplete from '@material-ui/lab/Autocomplete'
import styles from './header.module.scss'
import classnames from 'classnames'

export default function Header({ itemTags }) {

  const [ session, loading ] = useSession()
  const router = useRouter();
  
  const [searchInput, setSearchInput] = useState('');
  const [slideOutTriggered, setSlideOutTriggered] = useState(false);

  const doSearch = () => {
    if (searchInput) {
      Router.push(`/search/${searchInput}`)
    }
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.siteLogo}>
        <Link href='/'>
          <a>potres<span>2020</span></a>
        </Link>
      </div>
      <div
        className={
          classnames(
            styles.slideOutMenu,
            styles[`${slideOutTriggered ? 'menuOpen' : 'menuClosed'}`],
          )
        }
      >
        <div className={styles.siteMainMenu}>
          <ul className={styles.menuItemsWrapper}>
            <li className={styles.menuItem}>
              <Link href='/smjestaj'>
                <a className={styles[(router.pathname == '/smjestaj') ? 'active' : 'inactive']}>Smještaji / Ponude</a>
              </Link>
            </li>
            <li className={styles.menuItem}>
              <Link href='/prijevoz'>
                <a className={styles[(router.pathname == '/prijevoz') ? 'active' : 'inactive']}>Prijevozi</a>
              </Link>
            </li>
            <li className={styles.menuItem}>
              <Link href='/prikup-donacija'>
                <a className={styles[(router.pathname == '/prikup-donacija') ? 'active' : 'inactive']}>Prikupi donacija</a>
              </Link>
            </li>
            <li className={styles.menuItem}>
              <Link href='/trazim-pomoc'>
                <a className={styles[(router.pathname == '/trazim-pomoc') ? 'active' : 'inactive']}><span className={styles.alert}>Tražim pomoć</span></a>
              </Link>
            </li>
            {session ? (
              <li className={styles.menuItem}>
                <Link href={`/zadaci-volontera/${session.user.email}`}>
                  <a className={styles[(router.pathname == `/zadaci-volontera/${session.user.email}`) ? 'active' : 'inactive']}><span>Moji zadaci</span></a>
                </Link>
              </li>
            ) : (
              <li className={styles.menuItem}>
                <Link href='/nova-kolekcija'>
                  <a className={styles[(router.pathname == '/nova-kolekcija') ? 'active' : 'inactive']}><span>Kreiraj kolekciju</span></a>
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className={styles.stuffRight}>

        <div className={styles.headerSearch}>
            <Autocomplete
              className={styles.searchInputField}
              options={itemTags}
              getOptionLabel={(tag) => tag.tag}
              style={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Pretraga po tagu" variant="outlined" />}
              onChange={(event, newValue) => {
                newValue ? setSearchInput(newValue.tag) : '';
              }}
              freeSolo={true}
            />
            <button className={styles.searchButton} onClick={() => doSearch()}><Search /></button>
          </div>

          <Link href='/dodaj-unos'>
            <a className={styles.addButton}>Dodaj unos</a>
          </Link>
          <div className={styles.headerAuth}>
            {session ? [
              <span className={styles.signedInHello}>Bok, {session.user.name.split(' ')[0]}</span>,
              <Link href='/api/auth/signout'><a className={styles.addButton}>Sign out</a></Link>
            ] : (
              <Link href='/api/auth/signin'><a className={styles.addButton}>Login</a></Link>
            )}
          </div>
        </div>
      </div>
      <button onClick={() => setSlideOutTriggered(!slideOutTriggered)} className={styles.mobileMenuButton}>
        {slideOutTriggered ? (
          <Close />
        ) : (
          <Menu />
        )}
      </button>
    </header>
  )
}
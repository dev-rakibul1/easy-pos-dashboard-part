'use client'

// Logo.tsx
import { theme } from 'antd'
import styles from './Logo.module.css'

const Logo = () => {
  const { token } = theme.useToken()
  return (
    <div className={styles.logoContainer}>
      <div
        className={styles.square}
        style={{ background: `${token.colorPrimary}` }}
      ></div>
      <div
        className={styles.square}
        style={{ background: `${token.colorPrimary}` }}
      ></div>
      <div
        className={styles.square}
        style={{ background: `${token.colorPrimary}` }}
      ></div>
      <div
        className={styles.square}
        style={{ background: `${token.colorPrimary}` }}
      ></div>
    </div>
  )
}

export default Logo

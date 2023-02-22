import { useEffect, useState } from 'react'
import {useSignOut} from '../hooks/useSignOut'
import { SignInModal, SignUpModal } from './components'

// context
import { useAuthContext } from '../hooks/useAuthContext'
import { useModalContext } from '../hooks/useModalContext'
import { useDateContext } from '../hooks/useDateContext'

// styles
import './Nav.css'

export default function Nav({children}) {
  const [monthAndYear, setMonthAndYear] = useState('')
  const { modalContext, setModalContext } = useModalContext()
  const { dateContext } = useDateContext()
  const { user } = useAuthContext()
  const { signout } = useSignOut()

  useEffect(() => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[dateContext.getMonth()]
    const year = dateContext.getFullYear()
    setMonthAndYear(`${month} ${year}`)
  }, [dateContext])

  function handleSignOut() {
    signout()
    setModalContext('')
  }

  return (
    <nav className="container">
      <div className="row">
        <div className="date">
          <h3>{monthAndYear}</h3>
          {children}
        </div>
        <div className="auth">
          {!user ? (
            <>
              <button className="btn" onClick={() => setModalContext('signin')}>Sign In</button>
              <button className="btn" onClick={() => setModalContext('signup')}>Sign Up</button>
              {modalContext === 'signin' && <SignInModal />}
              {modalContext === 'signup' && <SignUpModal />}
            </>
          ) : (
            <>
              <span>Welcome, {user.displayName}</span>
              <button className="btn logout-btn" onClick={handleSignOut}>Log Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
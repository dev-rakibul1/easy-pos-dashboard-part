import Image from 'next/image'

const HomePage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      <h1>Welcome from our dashboard</h1>

      <Image
        src="https://as1.ftcdn.net/v2/jpg/05/23/04/00/1000_F_523040057_JYMTxoQGquklUthNLLjspI7ldR1hrFlH.jpg"
        height={300}
        width={500}
        alt="image"
        layout="responsive"
      />
    </div>
  )
}

export default HomePage

import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJVCjSq2wlAiVgMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1scXN2ODBtN2dmcHc4a3I2LnVzLmF1dGgwLmNvbTAeFw0yNDA0MTYw
MjQxMjJaFw0zNzEyMjQwMjQxMjJaMCwxKjAoBgNVBAMTIWRldi1scXN2ODBtN2dm
cHc4a3I2LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBANwMZIcxWvmSUcbNsI76/BnntDohHJRbv6f2vxkllPEQDpFVv1enQmzCJ3e4
JXXcBkRCUsHmOWLbFV8i5pktI3PUAahaG4j9F5Mv6FzrBYWdlzjNlI/iT0Fgsz5I
Kx8GTU6Rh1mcWu3E58iKwzgnR4vHyuFWa1VUcWfS7j0Wwd5SreFn89cBmRQKdCdS
IZdn+PVq70zKUXBIkU0ulUQCnAbwhINcVx8z4QJSI6fKiSzWIoPrY7wHmC92wHHa
aBpG7GpaSALW6TXJeT8T+lDJfYsGAXxiledvSNM6IQG2pfWqX6/1p+skm9ujuLcM
LPe4BdyhucZjThJmRCRmx01I2hECAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUWAtbNzp/81Du00sD75viqH/Q1WYwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQDVZyuGFj+3GaJK8tRGj44tAaXcA4L3E6HZOOZkaegH
B36Dx8V7u9dbeLMGwbTTu/YLqYzdtWvAb730HOjBIx7V9leKWYkusuyc7/pFOYt/
D31UKILiX/K9v0ffvPF2gDm0qsw7brICzi0Ljv2DXEzkpLtvDfObO2xjU5IoUJTC
pkqV1GSplBviZxpVESC8Y5ZdpSj15f5j1c6OkSsraBLtW3ygD0rQpwcWUYnJ2lwG
nVow+lxTaObe33yR7B63witbpGg08UE7x+nVv42wmWZaP8Gs3nbgfW0Rw2VuqWLL
/N9UR6brQauPHTA+3NKyHTKQRroeSH5fyJC9rId7qjo+
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User authorized')
    
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)

  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

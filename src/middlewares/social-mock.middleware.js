const randomId = Math.random().toString().slice(2);

/**
 * Handles mock requests to the oauth routes
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @param {callback} next
 * @returns {undefined}
 */
export default (req, res, next) => {
  // GOOGLE
  const resp = {
    google: {
      id: randomId,
      displayName: 'Northstar Barefootnomad',
      name: {
        familyName: 'Barefootnomad',
        givenName: 'Northstar'
      },
      emails: [
        {
          value: 'north@gmail.com',
          verified: true
        }
      ],
      photos: [
        {
          value: 'https://lh3.googleusercontent.com/-rwHxJC1XRRI/AAAAAAAAAAI/AAAAAAAAAAA/photo.jpg'
        }
      ],
      provider: 'google',
      _raw: {
        sub: randomId,
        name: 'Northstar Barefootnomad',
        given_name: 'Northstar',
        family_name: 'Barefootnomad',
        picture: 'https://lh3.googleusercontent.com/-rwHxJC1XRRI/AAAAAAAAAAI/AAAAAAAAAAA/photo.jpg',
        email: 'north@gmail.com',
        email_verified: true,
        locale: 'en'
      },
      _json: {
        sub: randomId,
        name: 'Northstar Barefootnomad',
        given_name: 'Northstar',
        family_name: 'Barefootnomad',
        picture: 'https://lh3.googleusercontent.com/-rwHxJC1XRRI/AAAAAAAAAAI/AAAAAAAAAAA/photo.jpg',
        email: 'north@gmail.com',
        email_verified: true,
        locale: 'en'
      }
    },
    // FACEBOOK USER
    facebook: {
      id: randomId,
      name: {
        familyName: 'Barefoot',
        givenName: 'Nomad',
        middleName: 'Boy'
      },
      emails: [
        {
          value: 'north@gmail.com'
        }
      ],
      provider: 'facebook',
      _raw: {
        id: '2651400934879505',
        last_name: 'Barefoot',
        first_name: 'Nomad',
        middle_name: 'Boy',
        email: 'north@gmail.com'
      },
      _json: {
        id: randomId,
        last_name: 'Barefoot',
        first_name: 'Nomad',
        middle_name: 'Boy',
        email: 'north@gmail.com'
      }
    },

    // GOOGLE USER WITHOUT EMAIL
    google_fail: {
      id: randomId,
      displayName: 'Northstar Barefootnomad',
      name: {
        familyName: 'Barefootnomad',
        givenName: 'Northstar'
      },
      photos: [
        {
          value: 'https://lh3.googleusercontent.com/-rwHxJC1XRRI/AAAAAAAAAAI/AAAAAAAAAAA/photo.jpg'
        }
      ],
      provider: 'google',
      _raw: {
        sub: randomId,
        name: 'Northstar Barefootnomad',
        given_name: 'Northstar',
        family_name: 'Barefootnomad',
        picture: 'https://lh3.googleusercontent.com/-rwHxJC1XRRI/AAAAAAAAAAI/AAAAAAAAAAA/photo.jpg',
        locale: 'en'
      },
      _json: {
        sub: randomId,
        name: 'Northstar Barefootnomad',
        given_name: 'Northstar',
        family_name: 'Barefootnomad',
        picture: 'https://lh3.googleusercontent.com/-rwHxJC1XRRI/AAAAAAAAAAI/AAAAAAAAAAA/photo.jpg',
        locale: 'en'
      }
    },
    // FACEBOOK USER WITHOUT EMAIL
    facebook_fail: {
      id: randomId,
      name: {
        familyName: 'Barefoot',
        givenName: 'Nomad',
        middleName: 'Boy'
      },
      provider: 'facebook',
      _raw: {
        id: randomId,
        last_name: 'Barefoot',
        first_name: 'Nomad',
        middle_name: 'Boy',
      },
      _json: {
        id: randomId,
        last_name: 'Barefoot',
        first_name: 'Nomad',
        middle_name: 'Boy',
      }
    }
  };

  req.user = resp[req.body.provider];
  next();
};

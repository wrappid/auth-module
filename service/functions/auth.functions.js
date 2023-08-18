const { cacheActions, databaseActions, databaseProvider } = require("@wrappid/service-core");


/**
 *
 * @returns
 */
const checkLoginOrRegister = async (req) => {
  try {
    // var iWsValidJOI = await authenticateJOI(req,"checkLoginOrRegisterPOST",["body","query"])
    var emailOrPhone = req.body.emailOrPhone;
    var ob = clearValidatePhoneEmail(emailOrPhone);
    var whereOb = {};
    if (ob.type === constant.communication.EMAIL)
      whereOb = { email: emailOrPhone };
    else if (ob.type === constant.communication.SMS)
      whereOb = { phone: emailOrPhone };
    else {
      console.log("Not a valid email or phone");
      return { staus: 500, message: "Not a valid email or phone" }
    }

    let data = await databaseActions.Users.findOne({
      where: whereOb,
    });

    if (data) {
      if(data.firstLogin){
        console.log("User found, first time login", data.id);
        return { status: 201, message: "First login for created user" };
      }
      else{
        console.log("User found", data.id);
        var personData = await databaseActions.Persons.findOne({
          where: {
            userId: data.id,
          },
        });
  
        return {
          status: 200,
          message: "User Found",
          data: {
            name:
              personData.firstName +
              " " +
              personData.middleName +
              " " +
              personData.lastName,
            photoUrl: personData.photoUrl,
            isVerified: personData.isVerified,
          },
        }
      }
    } else {      
      if (ob.valid) {
        var userBody = whereOb;
        try {
          const result = await databaseProvider.application.sequelize.transaction(async (t) => {
           //Changed
            var r = await databaseActions.findOne("application","Roles",{
              where: { role: "doctor" },
            });
            var u = await databaseActions.create(
              {
                ...userBody,
                roleId: r.id,
                firstLogin: true,
              },
              { transaction: t }
            );
            console.log("User Created", u.id);

            var p = await databaseActions.Persons.create(
              {
                ...userBody,
                profileId: Date.now(),
                userId: u.id,
                /**
                 * @todo
                 * added for phase 0.5
                 */
                isVerified: true,
              },
              { transaction: t }
            );
            console.log("Person Created", u.id);

            var p = await databaseActions.PersonContacts.create(
              {
                data: emailOrPhone,
                type:
                  ob.type === constant.communication.EMAIL
                    ? constant.contact.EMAIL
                    : constant.contact.PHONE,
                personId: p.id,
                _status: constant.entityStatus.ACTIVE,
              },
              { transaction: t }
            );
            console.log("Person contact Created", p.id);

            return { status: 201, message: "New User created" };
          });
          console.log("New User created");
          return result
        } catch (error) {
          console.error("internal error", error);
          return {status: 500, message: "Internal error" };
        }
      } else {
        console.error("Not a valid mail or phone:", emailOrPhone);
        return {status: 405, message: "Not valid phone or email" };
      }
    }
  } catch (err) {
    console.log("Error in check register", err);
    return {status: 500, message: err };
  }
};

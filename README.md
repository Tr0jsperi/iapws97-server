# IAPWS97 Server

Nodejs IAPWS97 server api based on 
[Neutrium.thermo.IAPWS97](https://github.com/neutrium/thermo.eos.iapws97) &
[thermo](https://github.com/dsantonio/thermo)

add functions to calculate saturation parameter

## POST methods
post {{url}}/iapws97_PT
{{header}} 

{
    "p": 3000000 , "t": 473.15
} 

post {{url}}/iapws97_PS
{{header}} 

{
    "p": 3000000 , "s": 3.4
} 

post {{url}}/iapws97_PH
{{header}} 

{
    "p": 3000000 , "h": 1500
} 

post {{url}}/iapws97_HS
{{header}} 

{
    "h": 1500 , "s": 3.40
} 

post {{url}}/iapws97_P
{{header}} 

{
    "p": 3000000
} 

post {{url}}/iapws97_T
{{header}} 

{
    "t": 473.15
} 



## Response

	{
		p, 		// Pressure, p, Pa
		t, 		// Temperature, t, K
		v, 		// Specific volume, v, m^3/kg
		rho,	// Density, rho, kg/m^3
		u,		// Specific internal energy, u, kJ/kg
		s,		// Specific entropy, s, kJ/kg
		h, 		// Specific enthalpy, h, kJ/kg.K
		cp,		// Specific isobaric heat capacity, Cp kJ/kg.K
		cv,		// Specific isochoric heat capacity, Cv
		w,		// Speed of Sound, w, m/s
		mu,		// Viscosity cP,
		k,		// Thermal Conductivity W/m.K
		sigma,	// Surface Tension mN/m
		epsilon,// Dielectric constant
		ic		// Ionisation constant
	}

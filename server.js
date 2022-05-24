const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const neutrium = require('@tr0j332/thermo.eos.iapws97')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function (error, req, res, next) {
  if(error instanceof SyntaxError){
    return res.status(500).send({
      'success': false,
      'message':'Invalid Data',
      'data': null,
    });
  } else {
    next()
  }
})
//iapws97输入条件
//pressure (Pa), temperature (K), enthalpy (kJ/kg.K) and entropy (kJ/K.kg). 
let EoS = new neutrium.IAPWS97_EoS()

app.post('/iapws97_PT', (req, res) => {
  return callSolve(res, {p: req.body.p, t: req.body.t })
})

app.post('/iapws97_PH', (req, res) => {
  return callSolve(res, {p: req.body.p, h: req.body.h })
})

app.post('/iapws97_PS', (req, res) => {
  return callSolve(res, {p: req.body.p, s: req.body.s })
})

app.post('/iapws97_HS', (req, res) => {
  return callSolve(res, {h: req.body.h, s: req.body.s })
})

app.post('/iapws97_P', (req, res) => {
  return callSolve(res, {p: req.body.p, t: r4_P_Tsat(req.body.p/1000000)})
})

app.post('/iapws97_T', (req, res) => {
  return callSolve(res, {p: r4_T_Psat(req.body.t)*1000000, t: req.body.t})
})

app.use(function(req, res, next) {
  res.status(501)
  res.json({
    'success': false,
    'message':'Invalid Request',
    'data': null,
  })
  next()
})

app.listen(9008, () => {
  console.log('Server started on port 9008')
})

function callSolve(res, inputs) {
  /*
  var p = 3000000;
  var t = 300;
  var h = 1500;
  var s = 3.4;
  */

  try {
    let solved = EoS.solve(inputs)
    return res.status(200).send({
      success: true,
      message: '',
      data: solved
    })
  } catch (error) {
    console.log(error)
    return res.status(400).send({
      success: false,
      message: 'Wrong params or Input valves are outside the range of the IAPWS97 correlations',
      data: null
    })    
  }
}

// 根据压力求饱和温度,输入压力MPa，输出温度K
// Range of validity is 0.000611213 MPa (611.213 Pa) <= p <= 22.064 MPa
function r4_P_Tsat(P) {
  var R4_PT_N = [1167.0521452767, -724213.16703206, -17.073846940092, 12020.82470247, -3232555.0322333, 14.91510861353, -4823.2657361591, 405113.40542057, -0.238558557567849, 650.17534844798], b = Math.pow(P, 0.25), E = b * b + R4_PT_N[2] * b + R4_PT_N[5], F = R4_PT_N[0] * b * b + R4_PT_N[3] * b + R4_PT_N[6], G = R4_PT_N[1] * b * b + R4_PT_N[4] * b + R4_PT_N[7], D = 2.0 * G / (-F - Math.pow(F * F - 4.0 * E * G, 0.5));
  return (R4_PT_N[9] + D - Math.pow(Math.pow(R4_PT_N[9] + D, 2) - 4.0 * (R4_PT_N[8] + R4_PT_N[9] * D), 0.5)) / 2.0;
}
//根据温度求饱和压力，输入温度K，输出压力MPa
// Range of validity is 273.15 K <= T <= 647.096 K
function r4_T_Psat(T) {
  var Tr = T, v = Tr + -0.238558557567849 / (Tr - 650.17534844798), A = v * v + 1167.0521452767 * v + -724213.16703206, B = -17.073846940092 * v * v + 12020.82470247 * v + -3232555.0322333, C = 14.91510861353 * v * v + -4823.2657361591 * v + 405113.40542057;
  return Math.pow(2 * C / (-B + Math.pow(B * B - 4 * A * C, 0.5)), 4);
}

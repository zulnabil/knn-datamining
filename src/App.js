import React from 'react';
import logo from './logo.svg';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import KNN from 'ml-knn'

import SimpleTable from './components/Table'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
}));

function App() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    umur: '',
    sks: '',
    tinggal: '',
    nm: '',
  });

  const [hasilKlasifikasi, setHasilKlasifikasi] = React.useState('')

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  function createData(nim, umur, sks, tinggal, nm, kelas) {
    return { nim, umur, sks, tinggal, nm, kelas };
  }

  const headTable = ['No.','NIM', 'Umur', 'Jumlah SKS', 'Jenis Tinggal', 'Jumlah Nilai Mutu', 'Predikat (Kelas)']

  const dataTable = [
      createData(11253100111, 20, 91, "Wali", 200, "Sangat Memuaskan"), 
      createData(11253100147, 20, 91, "Wali", 200, "Sangat Memuaskan"), 
      createData(11253100228, 21, 81, "Kos", 200, "Memuaskan"), 
      createData(11253100230, 20, 81, "Kos", 200, "Memuaskan"), 
      createData(11253100296, 21, 81, "Kos", 223, "Sangat Memuaskan"), 
      createData(11253100301, 21, 81, "Wali", 200, "Memuaskan"), 
      createData(11253100309, 21, 91, "Wali", 200, "Memuaskan"), 
      createData(11253100311, 21, 81, "Wali", 200, "Cukup"), 
      createData(11253100499, 21, 81, "Wali", 210, "Memuaskan")
  ]

  const [stateData, setStateData] = React.useState(dataTable)

  const handleConvert = () => {
    setStateData(
      stateData.map((index) => {
        let umur = 0
        let sks = 0
        let tinggal = 0
        let nm = 0
        let kelas = 0

        // umur
        if (index.umur < 21) {
          umur = 0
        } else if (index.umur == 21) {
          umur = 1
        } else {
          umur = 2
        }

        // sks
        if (index.sks < 81) {
          sks = 0
        } else if (index.sks == 81) {
          sks = 1
        } else {
          sks = 2
        }

        // tinggal
        if (index.tinggal == 'Wali') {
          tinggal = 0
        } else if (index.tinggal == 'Kos') {
          tinggal = 1
        } else {
          tinggal = 2
        }

        // nm
        if (index.nm < 200) {
          nm = 0
        } else if (index.nm == 200) {
          nm = 1
        } else {
          nm = 2
        }

        if (index.kelas == 'Pujian') {
          kelas = 0
        } else if (index.kelas == 'Sangat Memuaskan') {
          kelas = 1
        } else if (index.kelas == 'Memuaskan') {
          kelas = 2
        } else {
          kelas = 3
        }

        return {
          nim: index.nim,
          umur,
          sks,
          tinggal,
          nm,
          kelas
        }
      })
    )
    // console.log(stateData)
  }

  const handleClassify = () => {
    let dataSetTraining = []
    let kelasTraining = []
    stateData.map((index) => {
      dataSetTraining.push([index.umur, index.sks, index.tinggal, index.nm])
      kelasTraining.push(index.kelas)
    })
    let dataTest = [parseInt(values.umur), parseInt(values.sks), parseInt(values.tinggal), parseInt(values.nm)]
    let knn = new KNN(dataSetTraining, kelasTraining, { k: 3 });
    let hasil = knn.predict(dataTest)
    console.log(hasil)
    setHasilKlasifikasi('Data uji diklasifikasikan ke kelas: '+hasil)
  }

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <SimpleTable head={headTable} data={stateData} />
        <button onClick={handleConvert}>Konversi ke Diskrit</button>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="standard-umur"
            label="Umur"
            className={classes.textField}
            value={values.name}
            onChange={handleChange('umur')}
            margin="normal"
          />
          <TextField
            id="standard-sks"
            label="Jumlah SKS"
            className={classes.textField}
            value={values.sks}
            onChange={handleChange('sks')}
            margin="normal"
          />
          <TextField
            id="standard-tinggal"
            label="Jenis Tinggal"
            className={classes.textField}
            value={values.tinggal}
            onChange={handleChange('tinggal')}
            margin="normal"
          />
          <TextField
            id="standard-nm"
            label="Jumlah Nilai Mutu"
            className={classes.textField}
            value={values.nm}
            onChange={handleChange('nm')}
            margin="normal"
          />
        </form>
        <button onClick={handleClassify}>Klasifikasi</button>
        <p>{hasilKlasifikasi}</p>
      </div>
      <div>

      </div>
    </div>
  );
}

export default App;

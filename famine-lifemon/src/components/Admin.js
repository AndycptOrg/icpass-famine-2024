import React, { useState, useEffect } from 'react';
import { MenuItem, TextField } from '@mui/material';
import { debug } from './secret/Secret';

import Code from './Code';
import Church from './locations/Church';
import CommunityCentre from './locations/CommunityCentre';
import Corporation from './locations/Corporation';
import Factory from './locations/Factory';
import Farm from './locations/Farm';
import FoodBank from './locations/FoodBank';
import Hospital from './locations/Hospital';
import ICEntertainment from './locations/ICEntertainment';
import JobCentre from './locations/JobCentre';
import Lab from './locations/Lab';
import PoliceStationPrison from './locations/PoliceStationPrison';
import Treasury from './locations/Treasury';
import School from './locations/School';
import YellowGambleDrug from './locations/YellowGambleDrug';

const Admin = () => {
  const locations = [
    'Church',
    'Community Centre',
    'Corporation',
    'Factory',
    'Farm',
    'Food Bank',
    'Hospital',
    'IC Entertainment',
    'Job Centre',
    'Lab',
    'Police Station & Prison',
    'School',
    'Treasury',
    'Yellow Gamble Drug',
  ];
  const ChurchID = locations.indexOf('Church');
  const CommunityCentreID = locations.indexOf('Community Centre');
  const CorporationID = locations.indexOf('Corporation');
  const FactoryID = locations.indexOf('Factory');
  const FarmID = locations.indexOf('Farm');
  const FoodBankID = locations.indexOf('Food Bank');
  const HospitalID = locations.indexOf('Hospital');
  const JobCentreID = locations.indexOf('Job Centre');
  const EntertainmentID = locations.indexOf('IC Entertainment');
  const LabID = locations.indexOf('Lab');
  const PoliceStationPrisonID = locations.indexOf('Police Station & Prison');
  const TreasuryID = locations.indexOf('Treasury');
  const SchoolID = locations.indexOf('School');
  const GambaID = locations.indexOf('Yellow Gamble Drug');

	const [formData, setFormData] = useState({
		food: 0,
		happiness: 0,
		money: 0,
		charity: 0,
	});

  const [location, setLocation] = useState('');

  const [timestamp, setTimestamp] = useState(Date.now());
	const updateTimestamp = () => {
		setTimestamp(Date.now());
	}

	useEffect(() => {
    const intervalId = setInterval(updateTimestamp, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLocationChange = e => {
    const value = e.target.value;
    setLocation(value);
    setFormData({
      food: 0,
      happiness: 0,
      money: 0,
      charity: 0,
    });
  }

  return (
    <>
      <TextField
        required
        id="location-select"
        size='large'
        value={location}
        label="Location"
        onChange={handleLocationChange}
        sx={{width: '20em'}}
        select
        fullWidth
        margin='dense'
      >
        {
          locations.map((location, i) => 
            <MenuItem key={i} value={i}>{location}</MenuItem>
          )
        }
      </TextField>
      {
        (location === ChurchID) ? <Church setFormData={setFormData} /> :
        (location === CommunityCentreID) ? <CommunityCentre setFormData={setFormData} /> :
        (location === CorporationID) ? <Corporation setFormData={setFormData} /> :
        (location === FactoryID) ? <Factory setFormData={setFormData} /> :
        (location === FarmID) ? <Farm setFormData={setFormData} /> :
        (location === FoodBankID) ? <FoodBank setFormData={setFormData} /> :
        (location === HospitalID) ? <Hospital setFormData={setFormData} /> :
        (location === EntertainmentID) ? <ICEntertainment setFormData={setFormData} /> :
        (location === JobCentreID) ? <JobCentre setFormData={setFormData} /> :
        (location === LabID) ? <Lab setFormData={setFormData} /> :
        (location === PoliceStationPrisonID) ? <PoliceStationPrison setFormData={setFormData} /> :
        (location === TreasuryID) ? <Treasury setFormData={setFormData} /> :
        (location === SchoolID) ? <School setFormData={setFormData} /> :
        (location === GambaID) ? <YellowGambleDrug setFormData={setFormData} /> :
        <></>
      }
      {
        (debug) ? <div style={{ marginTop: 12 }}>
          <strong>Current formData:</strong>
          <pre style={{ background: '#f6f6f6', padding: 8, borderRadius: 4 }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div> : <></>
      }
      <Code
        header="famine-2023-lifemon"
        food={formData.food}
        foodBank={formData.foodBank}
        happiness={formData.happiness}
        money={formData.money}
        education={formData.education}
        charity={formData.charity}
        married={formData.married}
        timestamp={timestamp}
        password={formData.password}
      />
    </>
  );
}

export default Admin;

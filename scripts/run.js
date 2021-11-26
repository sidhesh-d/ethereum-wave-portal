const { randomBytes } = require("tweetnacl");

const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy( {
      value: hre.ethers.utils.parseEther('0.5'),
  });
  await waveContract.deployed();

  console.log("WavePortal contract deployed to:", waveContract.address);
  console.log("WavePortal contract owner: ", owner.address);

   /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );
  contractBalance = await hre.ethers.provider.getBalance(owner.address);
    console.log(
        'Owner balance:',
        hre.ethers.utils.formatEther(contractBalance)
    );
    // random person balance
   contractBalance = await hre.ethers.provider.getBalance(randomPerson.address);
  console.log(
    'Random person balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let waveTotal;

  // first wave from owner
  let waveTxn = await waveContract.wave('hello');
  await waveTxn.wait();
  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );


  // first wave from random person
  waveTxn = await waveContract.connect(randomPerson).wave('random person here');
  await waveTxn.wait();

  //second wave from owner
  waveTxn = await waveContract.wave('hello');
  await waveTxn.wait();
  // second wave from randon person
  await waveContract.connect(randomPerson).wave('random person here');
  await waveTxn.wait();

  // contract balance
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );
    // owner balance
   contractBalance = await hre.ethers.provider.getBalance(owner.address);
    console.log(
        'Owner balance:',
        hre.ethers.utils.formatEther(contractBalance)
    );
    // random person balance
   contractBalance = await hre.ethers.provider.getBalance(randomPerson.address);
  console.log(
    'Random person balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();


// const onNewWave = (from, timestamp, message) => {
//     console.log('NewWave', from, message, timestamp);
//     setAllWaves(prevState => [
//       ...prevState,
//       {
//         address: from,
//         timestamp: new Date(timestamp * 1000),
//         message: message,
//       },
//     ]);
//     getTotalWaves();
//     getTotalWavesFromCurrentAddr();
//   };

//   if (window.ethereum) {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();

//     wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
//     wavePortalContract.on('NewWave', onNewWave);
//   }

//   return () => {
//     if (wavePortalContract) {
//       wavePortalContract.off('NewWave', onNewWave);
//     }
//   };

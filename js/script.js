(async function init() {
    $("#login").hide();
    $("#logout").hide();

    const torus = new Torus();
    window.torus = torus;

    await torus.init();

    try {
      const user = await torus.getUserInfo();
      $("#text").text("Logged in as " + user.name + ".");
      $("#logout").show();
      await initWeb3();
    } catch (error) {
      $("#text").text("Didn't log in.");
      $("#login").show();
    }
  })();

  async function initWeb3() {
    const web3 = new Web3(window.torus.provider);
    const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);
    $("#address").text("Address: " + address + ".");
    $("#balance").text("Balance: " + balance + ".");
  }

  $("#login").click(function (event) {
    window.torus
      .login()
      .then(function () {
        return initWeb3();
      })
      .then(function () {
        return window.torus.getUserInfo();
      })
      .then(function (user) {
        $("#text").text("Logged in as " + user.name + ".");
        $("#error").hide();
        $("#logout").show();
        $("#login").hide();
      })
      .catch(function (err) {
        $("#error").text(err.message);
      });
  });

  $("#logout").click(function (event) {
    window.torus
      .logout()
      .then(function (res) {
        $("#text").text("Logged out.");
        $("#address").text("");
        $("#balance").text("");
        $("#login").show();
        $("#logout").hide();
      })
      .catch(function (err) {
        $("#error").text(err.message);
      });
  });
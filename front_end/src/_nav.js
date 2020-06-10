export default {
  items: [
    {
      name: 'Dashboard',
      url: '/cash/sales_breakdown',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    /*
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    */
    /*
    {
      title: true,
      name: 'CASH IN',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    */
    {
      name: 'CASH-IN',
      url: '/cash',
      icon: 'icon-magnifier-add',
      children: [
        {
          name: 'Sales Deposit',
          url: '/cash/cash_deposit',
          icon: 'fa fa-cart-plus',
        },
        {
          name: 'Other Deposit',
          url: '/cash/other_deposit',
          icon: 'icon-book-open',
        },
        {
          name: 'Cash Receivable',
          url: '/cash/cash_receivable',
          icon: 'fa fa-pencil-square',
        },
        /*
        {
          name: 'Sales Audit',
          url: '/cash/sales_audit',
          icon: 'icon-puzzle',
        },
        {
          name: 'Dynamic Table',
          url: '/cash/dynamic_table',
          icon: 'icon-puzzle',
        },
        */
      ],
    },
      /*
    {
      title: true,
      name: 'CASH OUT',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    */
    {
      name: 'CASH-OUT',
      url: '/cash',
      icon: 'icon-magnifier-remove',
      children: [
        {
          name: 'Sales Withdrawal',
          url: '/cash/cash_withdrawal',
          icon: 'fa fa-cart-arrow-down',
        },
        {
          name: 'Recon Withdrawal',
          url: '/cash/recon_withdrawal',
          icon: 'icon-notebook',
        },
      ],
    },
    /*
    {
      title: true,
      name: 'SALES',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    */
    {
      name: 'REPORTS',
      url: '/cash',
      icon: 'icon-magnifier-remove',
      children: [
        {
          name: 'Sales Breakdown',
          url: '/cash/sales_breakdown',
          icon: 'fa fa-cart-arrow-down',
        },
      ],
    },
    /*
    {
      title: true,
      name: 'BANK',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    */
    /*
    {
      name: 'RECONCILE DEPOSIT',
      url: '/cash',
      icon: 'icon-magnifier-remove',
      children: [
        {
          name: 'Bank Recon Deposit',
          url: '/cash/bank_recon_deposit',
          icon: 'fa fa-cart-arrow-down',
        },
      ],
    },
    */
    /*
    {
      title: true,
      name: 'Extras',
    },
    {
      name: 'Other Pages',
      url: '/pages',
      icon: 'icon-star',
      children: [
        {
          name: 'Login',
          url: '/login',
          icon: 'icon-star',
        },
        {
          name: 'Register',
          url: '/register',
          icon: 'icon-star',
        },
        */
        /*
        {
          name: 'Error 404',
          url: '/404',
          icon: 'icon-star',
        },
        {
          name: 'Error 500',
          url: '/500',
          icon: 'icon-star',
        },
        
      ],
    },
    */
    /*
    {
      name: 'test1',
      url: 'http://',
      icon: 'icon-cloud-download',
      class: 'mt-auto',
      variant: 'success',
    },
    {
      name: 'test2',
      url: 'http://',
      icon: 'icon-layers',
      variant: 'danger',
    },
    */
  ],
};

angular.module('app.routes',['ui.router'])
	.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise("/home");
		
		$stateProvider
		.state('home', {
			url: "/home",
			views : {
				"" : {
					templateUrl:"app/components/home/homeView.html"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				"sidebar" : {
					templateUrl:"app/shared/sidebar/sidebarView.html",
					controller: "app.sidebarController"
				},
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('login', {
			url: "/login",
			views : {
				"" : {
					templateUrl:"app/components/login/loginView.html",
					controller: "app.loginController"
				}
			}
		})
		.state('procurement', {
			url: "/procurement",
			views : {
				"" : {
					templateUrl:"app/components/procurement/procurementView.html",
					controller: "app.procurementController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				"sidebar" : {
					templateUrl:"app/shared/sidebar/sidebarProcurementView.html",
					controller: "app.sidebarProcurementController"
				},
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('itservices', {
			url: "/itservices",
			views : {
				"" : {
					templateUrl:"app/components/itServices/itServicesView.html",
					//controller: "app.procurementController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				"sidebar" : {
					templateUrl:"app/shared/sidebar/sidebarITServiceView.html",
					controller: "app.sidebarITServiceController"
				},
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('hrservices', {
			url: "/hrservices",
			views : {
				"" : {
					templateUrl:"app/components/hrServices/hrServicesView.html",
					//controller: "app.procurementController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				"sidebar" : {
					templateUrl:"app/shared/sidebar/sidebarHRManagementView.html",
					controller: "app.sidebarHRManagementController"
				},
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('report', {
			url: "/report",
			views : {
				"" : {
					templateUrl:"app/components/report/reportView.html",
					//controller: "app.procurementController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				"sidebar" : {
					templateUrl:"app/shared/sidebar/sidebarView.html",
					controller: "app.sidebarController"
				},
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('hotel', {
			url: "/hotelservices",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/hotelServicesView.html",
					controller: "app.hotelServicesController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				"sidebar" : {
					templateUrl:"app/shared/sidebar/sidebarHotelView.html",
					controller: "app.sidebarHotelController"
				},
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('hotelPeriod', {
			url: "/hotelperiod",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/period/periodView.html",
					controller: "app.periodController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				"sidebar" : {
					templateUrl:"app/shared/sidebar/sidebarHotelView.html",
					controller: "app.sidebarHotelController"
				},
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('createHotelProject', {
			url: "/createhotelproject",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/hotelCreateServicesView.html",
					controller: "app.hotelCreateServicesController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				 "sidebar" : {
				 	templateUrl:"app/shared/sidebar/sidebarHotelView.html",
				 	controller: "app.sidebarHotelController"
				 },
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('hotelBudget', {
			url: "/hotelBudget/create",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/budget/createBudget/hotelBudgetView.html",
					controller: "app.hotelBudgetController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				 "sidebar" : {
				 	templateUrl:"app/shared/sidebar/sidebarHotelView.html",
				 	controller: "app.sidebarHotelController"
				 },
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('hotelViewBudget', {
			url: "/hotelBudget/view",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/budget/viewBudget/hotelViewBudgetView.html",
					controller: "app.hotelViewBudgetController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				 "sidebar" : {
				 	templateUrl:"app/shared/sidebar/sidebarHotelView.html",
				 	controller: "app.sidebarHotelController"
				 },
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('hotelForecast', {
			url: "/hotelForecast/create",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/forecast/createForecast/forecastView.html",
					controller: "app.hotelForecastController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				 "sidebar" : {
				 	templateUrl:"app/shared/sidebar/sidebarHotelView.html",
				 	controller: "app.sidebarHotelController"
				 },
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('hotelViewForecast', {
			url: "/hotelForecast/view",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/forecast/viewForecast/monthlyForecastView.html",
					controller: "app.hotelViewForecastController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				 "sidebar" : {
				 	templateUrl:"app/shared/sidebar/sidebarHotelView.html",
				 	controller: "app.sidebarHotelController"
				 },
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('hotelHistoryForecast', {
			url: "/hotelForecast/history",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/forecast/historyForecast/historyForecastView.html",
					controller: "app.hotelHistoryForecastController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				 "sidebar" : {
				 	templateUrl:"app/shared/sidebar/sidebarHotelView.html",
				 	controller: "app.sidebarHotelController"
				 },
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('hotelUnlock', {
			url: "/hotel/unlock",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/unlock/unlockView.html",
					controller: "app.hotelUnlockController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				 "sidebar" : {
				 	templateUrl:"app/shared/sidebar/sidebarHotelView.html",
				 	controller: "app.sidebarHotelController"
				 },
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('hotelActual', {
			url: "/hotelActual",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/hotelDataEntryActualView.html",
					controller: "app.hotelDataEntryActualController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				 "sidebar" : {
				 	templateUrl:"app/shared/sidebar/sidebarHotelView.html",
				 	controller: "app.sidebarHotelController"
				 },
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('hotelViewActual', {
			url: "/hotelActual/view",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/actual/viewActual/hotelViewActualView.html",
					controller: "app.hotelViewActualController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				 "sidebar" : {
				 	templateUrl:"app/shared/sidebar/sidebarHotelView.html",
				 	controller: "app.sidebarHotelController"
				 },
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('hotelPNL', {
			url: "/hotelPNL",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/hotelPNLView.html",
					controller: "app.hotelPNLController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				 "sidebar" : {
				 	templateUrl:"app/shared/sidebar/sidebarHotelView.html",
				 	controller: "app.sidebarHotelController"
				 },
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('hotelCashFlow', {
			url: "/hotelCashFlow",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/cashflow/hotelCashFlowView.html",
					controller: "app.hotelCashFlowController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				 "sidebar" : {
				 	templateUrl:"app/shared/sidebar/sidebarHotelView.html",
				 	controller: "app.sidebarHotelController"
				 },
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})		
		.state('hotelDashBoard', {
			url: "/hotelDashBoard",
			views : {
				"" : {
					templateUrl:"app/components/hotelServices/dashboard/hotelGraphView.html",
					controller: "app.hotelGraphController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				 "sidebar" : {
				 	templateUrl:"app/shared/sidebar/sidebarHotelView.html",
				 	controller: "app.sidebarHotelController"
				 },
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('adminuserprofiles', {
			url: "/admin/userprofiles",
			views : {
				"" : {
					templateUrl:"app/components/adminUserProfiles/adminUserProfilesView.html",
					//controller: "app.procurementController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				"sidebar" : {
					templateUrl:"app/shared/sidebar/sidebarView.html",
					controller: "app.sidebarController"
				},
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('admintickets', {
			url: "/admin/tickets",
			views : {
				"" : {
					templateUrl:"app/components/adminTickets/adminTicketsView.html",
					//controller: "app.procurementController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				"sidebar" : {
					templateUrl:"app/shared/sidebar/sidebarView.html",
					controller: "app.sidebarController"
				},
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('admin', {
			url: "/admin",
			views : {
				"" : {
					templateUrl:"app/components/admin/adminView.html",
					controller: "app.adminController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				"sidebar" : {
					templateUrl:"app/shared/sidebar/sidebarAdminView.html",
					controller: "app.sidebarAdminController"
				},
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		})
		.state('userprofile', {
			url: "/user/profile",
			views : {
				"" : {
					templateUrl:"app/components/userProfile/userProfileView.html",
					controller: "app.userProfileController"
				},
				"extrabar" : {
					templateUrl:"app/shared/extrabar/extraBarView.html",
					controller: "app.extrabarController"
				},
				"header" : {
					templateUrl:"app/shared/header/headerView.html",
					controller: "app.headerController"
				},
				"sidebar" : {
					templateUrl:"app/shared/sidebar/sidebarUserProfileView.html",
					controller: "app.sidebarUserProfileController"
				},
				"footer" : {
					templateUrl:"app/shared/footer/footerView.html"
				}
			}
		});
	});
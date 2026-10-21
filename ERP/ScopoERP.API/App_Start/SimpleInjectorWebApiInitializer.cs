namespace ScopoERP.API.App_Start
{
    using System.Web.Http;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Microsoft.AspNet.Identity;
    using ScopoERP.API.Models;
    using ScopoERP.Domain.Models;
    using ScopoERP.Domain.Repositories;
    using SimpleInjector;
    using SimpleInjector.Integration.WebApi;
    using SimpleInjector.Lifestyles;
    using Microsoft.Owin.Security.DataHandler;
    using Microsoft.Owin.Security;
    using Microsoft.Owin.Security.DataHandler.Serializer;
    using Microsoft.Owin.Security.DataProtection;
    using Microsoft.Owin.Security.DataHandler.Encoder;

    public static class SimpleInjectorWebApiInitializer
    {
        public static void Initialize()
        {
            var container = new Container();
            container.Options.DefaultScopedLifestyle = new AsyncScopedLifestyle();
            
            InitializeContainer(container);
            container.Options.ResolveUnregisteredConcreteTypes = true;
            container.RegisterWebApiControllers(GlobalConfiguration.Configuration);
           
            container.Verify();
           
            GlobalConfiguration.Configuration.DependencyResolver =
                new SimpleInjectorWebApiDependencyResolver(container);
        }
     
        private static void InitializeContainer(Container container)
        {
            container.Register<ScopoContext>(Lifestyle.Scoped);
            container.Register<HRContext>(Lifestyle.Scoped);
            container.Register<UnitOfWork>(Lifestyle.Scoped);

            //container.Register<IUserStore<ApplicationUser>>(() => new UserStore<ApplicationUser>());
            container.Register<ITextEncoder, Base64UrlTextEncoder>();
            container.Register<ISecureDataFormat<AuthenticationTicket>, SecureDataFormat<AuthenticationTicket>>();
            container.Register<IDataSerializer<AuthenticationTicket>, TicketSerializer>();
            container.Register<IDataProtector>(() => new DpapiDataProtectionProvider().Create("ASP.NET Identity"));
        }
    }
}
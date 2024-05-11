// export const Authenticated: MethodDecorator = () => {
//   const userServiceInjector = Inject(UserService)
//
//   return function decorator(
//     target: any,
//     _propertyKey: string,
//     descriptor: PropertyDescriptor
//   ): void {
//     userServiceInjector(target, 'userService')
//     const method = descriptor.value
//
//     descriptor.value = async function wrapper(...args: any[]) {
//       if ('userService' in this) {
//         const userService = this.userService as UserService
//         userService.findUser()
//       }
//       return method.apply(this, args)
//     }
//   }
// }

export default class Matrix extends Array {

  constructor(...args) {
    super(...args)
    if(args.length > 0) {
      this.width = args[0].length
      this.height = args.length
    }
  }

}